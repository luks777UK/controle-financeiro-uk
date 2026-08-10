/* Nosso Controle 3.1.0 — aplicação refatorada */
const cfg={
  SUPABASE_URL:"https://lhihsssbsjfliggtlaza.supabase.co",
  SUPABASE_ANON_KEY:"sb_publishable_0bttyUW7ASI8ylAyZjLkPA_NS8eThfO",
  ...(window.APP_CONFIG||{})
};
if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY){
  alert("Configuração do Supabase ausente. Atualize o app.js.");
  throw new Error("Supabase configuration missing");
}
const sb=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
const $=id=>document.getElementById(id);
let user=null,householdId=null,householdCode=null,state=null,channel=null;
let calendarDate=new Date();

const initialState={
  cash:0,card:0,dailyGoal:70,
  bills:[
    {id:"council",name:"Council Tax",amount:117.5,due:"2026-09-01",reserved:0,paid:false},
    {id:"energy",name:"Energia",amount:95,due:"2026-08-02",reserved:0,paid:false},
    {id:"rent",name:"Aluguel",amount:800,due:"2026-08-15",reserved:0,paid:false},
    {id:"insurance",name:"Seguro do carro",amount:130,due:"2026-08-25",reserved:0,paid:false},
    {id:"water",name:"Água",amount:48,due:"2026-08-25",reserved:0,paid:false}
  ],
  history:[],incomes:[],expenses:[],vaultEntries:[],updatedAt:new Date().toISOString()
};

const icons={council:"🏛️",energy:"⚡",rent:"🏠",insurance:"🚗",water:"💧"};
const classes={council:"council",energy:"energy",rent:"rent",insurance:"insurance",water:"water"};
function money(v){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"GBP"}).format(Number(v)||0)}
function formatDate(s){return new Date(s+"T00:00:00").toLocaleDateString("pt-BR")}
function daysUntil(s){const n=new Date();n.setHours(0,0,0,0);return Math.ceil((new Date(s+"T00:00:00")-n)/86400000)}
function show(id){["authView","householdView","appView"].forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden");if(id==="appView")closeKeyboardAndResetViewport(true);if(id==="authView")setTimeout(restoreUsernameField,0)}
function feedback(id,t){$(id).textContent=t||""}

function fatalDiagnostic313(step,error,extra={}){
  try{
    const box=document.getElementById("fatalLoginDiagnostic");
    const text=document.getElementById("fatalLoginDiagnosticText");
    const lines=[
      `VERSÃO: 6.0.0-beta.6`,
      `ETAPA: ${step}`,
      `MENSAGEM: ${error?.message||String(error||"Erro desconhecido")}`
    ];
    if(error?.code)lines.push(`CÓDIGO: ${error.code}`);
    if(error?.details)lines.push(`DETALHES: ${error.details}`);
    if(error?.hint)lines.push(`SUGESTÃO: ${error.hint}`);
    if(error?.stack)lines.push(`STACK: ${error.stack}`);
    Object.entries(extra||{}).forEach(([k,v])=>lines.push(`${k.toUpperCase()}: ${v??"—"}`));
    if(text)text.textContent=lines.join("\n");
    if(box){
      box.style.setProperty("display","block","important");
      box.classList.remove("hidden");
    }
    console.error("[Nosso Controle 3.1.3]",step,error,extra);
  }catch(diagError){
    console.error("Falha ao mostrar diagnóstico",diagError,error);
  }
}
function clearFatalDiagnostic313(){
  const box=document.getElementById("fatalLoginDiagnostic");
  const text=document.getElementById("fatalLoginDiagnosticText");
  if(box)box.style.setProperty("display","none","important");
  if(text)text.textContent="";
}

function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2100)}
function makeCode(){return Math.random().toString(36).slice(2,10).toUpperCase()}

function closeKeyboardAndResetViewport(goTop=false){
  try{document.activeElement?.blur()}catch{}
  document.body.classList.add("keyboard-closing");
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(goTop)window.scrollTo({top:0,left:0,behavior:"instant"});
      else window.scrollTo({top:Math.max(0,window.scrollY),left:0,behavior:"instant"});
      document.body.classList.remove("keyboard-closing");
    });
  });
}
function restoreUsernameField(){
  const field=$("email");
  if(!field)return;
  const savedEmail=localStorage.getItem("nosso-controle-email");
  if(savedEmail)field.value=savedEmail;
}
async function boot(){
  restoreUsernameField();
  try{
    const {data,error}=await sb.auth.getSession();
    if(error){
      console.error("getSession:",error);
      show("authView");
      return;
    }
    const session=data?.session;
    if(!session){
      show("authView");
      return;
    }
    user=session.user;
    await loadMembership();
  }catch(error){
    console.error("boot:",error);
    show("authView");
  }
}
async function loadMembership(){
  if(!user?.id){
    show("authView");
    return;
  }

  const memberResult=await sb
    .from("household_members")
    .select("household_id")
    .eq("user_id",user.id)
    .maybeSingle();

  if(memberResult.error){
    console.error("household_members:",memberResult.error);fatalDiagnostic313("household_members",memberResult.error,{user_id:user?.id||"—"});
    feedback("authMsg","Login realizado, mas não foi possível carregar a casa financeira.");
    show("authView");
    return;
  }

  if(!memberResult.data?.household_id){
    show("householdView");
    return;
  }

  householdId=memberResult.data.household_id;

  const householdResult=await sb
    .from("households")
    .select("code")
    .eq("id",householdId)
    .maybeSingle();

  if(householdResult.error){
    console.warn("households:",householdResult.error);fatalDiagnostic313("households",householdResult.error,{household_id:householdId||"—"});
    householdCode="";
  }else{
    householdCode=householdResult.data?.code||"";
    updateShareCard310();
  }

  const loaded=await loadState();
  if(!loaded){
    feedback("authMsg","Login realizado, mas os dados financeiros não puderam ser carregados.");
    show("authView");
    return;
  }

  subscribe();
  show("appView");
}

async function loadState(){
  const result=await sb
    .from("finance_state")
    .select("data")
    .eq("household_id",householdId)
    .maybeSingle();

  if(result.error){
    console.error("finance_state:",result.error);fatalDiagnostic313("finance_state",result.error,{household_id:householdId||"—"});
    toast("Erro ao carregar os dados financeiros");
    return false;
  }

  if(!result.data?.data){
    state=structuredClone(initialState);
    const created=await sb
      .from("finance_state")
      .upsert({
        household_id:householdId,
        data:state,
        updated_at:new Date().toISOString()
      },{onConflict:"household_id"});

    if(created.error){
      console.error("Criar finance_state:",created.error);fatalDiagnostic313("Criar finance_state",created.error,{household_id:householdId||"—"});
      return false;
    }
  }else{
    state=result.data.data;
  }

  if(state.dailyGoal==null)state.dailyGoal=70;
  if(!state.displayName)state.displayName="Lucas";
  if(!Array.isArray(state.incomes))state.incomes=[];
  if(!Array.isArray(state.expenses))state.expenses=[];
  if(!Array.isArray(state.vaultEntries))state.vaultEntries=[];
  if(!Array.isArray(state.completedBills))state.completedBills=[];
  if(!Array.isArray(state.bills))state.bills=structuredClone(initialState.bills);

  state.vaultEntries=state.vaultEntries.map(x=>({...x,location:x.location||"envelope"}));
  state.bills=state.bills.map(b=>({
    frequency:b.frequency||"monthly",
    type:b.type||"fixed",
    currentInstallment:b.currentInstallment||null,
    totalInstallments:b.totalInstallments||null,
    completed:false,
    ...b
  }));

  render();
  setTimeout(()=>uploadAutomaticBackupV410({force:false,silent:true}),500);
  return true;
}


function calculateBillsGoal320(bills){
  const readAmount=value=>{
    if(typeof value==="number")return Number.isFinite(value)?value:0;
    let text=String(value??"").trim().replace(/[£\s]/g,"");
    if(text.includes(",")&&text.includes(".")){
      text=text.lastIndexOf(",")>text.lastIndexOf(".")
        ? text.replace(/\./g,"").replace(",",".")
        : text.replace(/,/g,"");
    }else if(text.includes(",")){
      text=text.replace(",",".");
    }
    const parsed=Number(text.replace(/[^\d.-]/g,""));
    return Number.isFinite(parsed)?parsed:0;
  };

  const readDate=(value,bill={})=>{
    const text=String(value??"").trim();

    let match=text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if(match)return new Date(+match[1],+match[2]-1,+match[3],12,0,0,0);

    match=text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if(match)return new Date(+match[3],+match[2]-1,+match[1],12,0,0,0);

    const dueDay=Number(bill.dueDay||bill.day||bill.due_day||0);
    if(dueDay>=1&&dueDay<=31){
      const now=new Date();
      const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
      let due=new Date(now.getFullYear(),now.getMonth(),dueDay,12);
      if(due<today)due=new Date(now.getFullYear(),now.getMonth()+1,dueDay,12);
      return due;
    }

    return null;
  };

  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);

  const active=(Array.isArray(bills)?bills:[])
    .filter(b=>!b.completed&&!b.paid)
    .map(b=>{
      const amount=readAmount(b?.amount??b?.total??b?.value??b?.price);
      const reserved=readAmount(b?.reserved??b?.saved??b?.allocated??b?.paidAmount);
      return {
        due:readDate(b?.due??b?.dueDate??b?.date,b),
        remaining:Math.max(0,amount-reserved)
      };
    })
    .filter(item=>item.remaining>0)
    .sort((a,b)=>{
      if(!a.due&&!b.due)return 0;
      if(!a.due)return 1;
      if(!b.due)return -1;
      return a.due-b.due;
    });

  if(!active.length)return 0;

  let cumulative=0;
  let undated=0;
  let goal=0;

  for(const item of active){
    if(!item.due){
      undated+=item.remaining;
      continue;
    }

    cumulative+=item.remaining;
    const days=Math.max(1,Math.ceil((item.due-today)/86400000)+1);
    goal=Math.max(goal,cumulative/days);
  }

  if(undated>0){
    const monthEnd=new Date(today.getFullYear(),today.getMonth()+1,0,12);
    const days=Math.max(1,Math.ceil((monthEnd-today)/86400000)+1);
    goal=Math.max(goal,(cumulative+undated)/days);
  }

  return Math.ceil(goal*100)/100;
}


const DEFAULT_MONTHLY_WORKDAYS_321=20;

function activeBillsTotal321(bills){
  return (Array.isArray(bills)?bills:[])
    .filter(b=>!b.completed&&!b.paid)
    .reduce((total,bill)=>{
      const raw=bill?.amount??bill?.total??bill?.value??0;
      let amount=0;

      if(typeof raw==="number"){
        amount=Number.isFinite(raw)?raw:0;
      }else{
        let text=String(raw??"").trim().replace(/[£\s]/g,"");
        if(text.includes(",")&&text.includes(".")){
          text=text.lastIndexOf(",")>text.lastIndexOf(".")
            ? text.replace(/\./g,"").replace(",",".")
            : text.replace(/,/g,"");
        }else if(text.includes(",")){
          text=text.replace(",",".");
        }
        const parsed=Number(text.replace(/[^\d.-]/g,""));
        amount=Number.isFinite(parsed)?parsed:0;
      }

      return total+Math.max(0,amount);
    },0);
}

function monthlyWorkdays321(){
  const configured=Number(state?.monthlyWorkdays);
  return Number.isFinite(configured)&&configured>0
    ? Math.round(configured)
    : DEFAULT_MONTHLY_WORKDAYS_321;
}

function calculateFixedWorkdayGoal321(bills){
  const total=activeBillsTotal321(bills);
  const workdays=Math.max(1,monthlyWorkdays321());
  return Math.ceil((total/workdays)*100)/100;
}

function savedForBills321(){
  const cash=Math.max(0,Number(state?.cash||0));
  const card=Math.max(0,Number(state?.card||0));
  return cash+card;
}

function updateFixedGoalCards321(bills=state?.bills||[]){
  if(!state)return;

  const total=activeBillsTotal321(bills);
  const workdays=monthlyWorkdays321();
  const goal=calculateFixedWorkdayGoal321(bills);
  const saved=savedForBills321();
  const cappedSaved=Math.min(saved,total);

  state.monthlyWorkdays=workdays;
  state.dailyGoal=goal;

  const goalElement=$("billDailyGoalTop");
  const savedElement=$("billAlreadySavedTop");
  const workdaysCaption=$("billWorkdaysCaption");
  const progressCaption=$("billSavedProgressTop");

  if(goalElement)goalElement.textContent=`${money(goal)} por dia`;
  if(savedElement)savedElement.textContent=money(saved);
  if(workdaysCaption){
    workdaysCaption.textContent=`${money(total)} ÷ ${workdays} dias trabalhados`;
  }
  if(progressCaption){
    const pct=total?Math.min(100,(cappedSaved/total)*100):100;
    progressCaption.textContent=`${money(saved)} de ${money(total)} · ${pct.toFixed(0)}%`;
  }
}


const BACKUP_BUCKET_V410="finance-backups";
let cloudBackupRunningV410=false;
function fullBackupPayloadV410(){return {schemaVersion:1,app:"Nosso Controle",appVersion:APP_VERSION,exportedAt:new Date().toISOString(),userId:user?.id||null,householdId:householdId||null,householdCode:householdCode||null,data:structuredClone(state)}}
function backupStoragePathV410(date=currentLocalDate()){return `${user?.id||"unknown-user"}/${householdId||"unknown-household"}/${date}.json`}
function setBackupStatusV410(message,tone="neutral"){const el=$("automaticBackupStatusV410");if(el){el.textContent=message;el.dataset.tone=tone}}
async function uploadAutomaticBackupV410({force=false,silent=true}={}){
  if(cloudBackupRunningV410||!user?.id||!householdId||!state)return false;
  const today=currentLocalDate(),marker=`nosso-control-backup-${householdId}`;
  if(!force&&localStorage.getItem(marker)===today){setBackupStatusV410(`Backup automático de hoje já salvo (${today}).`,"success");return true}
  cloudBackupRunningV410=true;setBackupStatusV410("Salvando backup externo…","working");
  try{
    const blob=new Blob([JSON.stringify(fullBackupPayloadV410(),null,2)],{type:"application/json"});
    const {error}=await sb.storage.from(BACKUP_BUCKET_V410).upload(backupStoragePathV410(today),blob,{upsert:true,contentType:"application/json",cacheControl:"0"});
    if(error)throw error;
    localStorage.setItem(marker,today);
    setBackupStatusV410(`Backup externo salvo hoje às ${new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}.`,"success");
    if(!silent)toast("Backup externo salvo");return true;
  }catch(error){
    setBackupStatusV410(error?.message?.toLowerCase().includes("bucket")?"Configure o bucket finance-backups no Supabase.":`Backup pendente: ${error?.message||"erro desconhecido"}`,"error");
    if(!silent)alert(`Não foi possível salvar o backup externo:\n\n${error?.message||String(error)}`);return false;
  }finally{cloudBackupRunningV410=false}
}
function normalizeImportedStateV410(){
  state.incomes=Array.isArray(state.incomes)?state.incomes:[];state.expenses=Array.isArray(state.expenses)?state.expenses:[];
  state.vaultEntries=Array.isArray(state.vaultEntries)?state.vaultEntries:[];state.history=Array.isArray(state.history)?state.history:[];
  state.completedBills=Array.isArray(state.completedBills)?state.completedBills:[];state.bills=Array.isArray(state.bills)?state.bills:[];
  state.cash=Number(state.cash||0);state.card=Number(state.card||0);state.monthlyWorkdays=Number(state.monthlyWorkdays||20);state.dailyGoal=calculateFixedWorkdayGoal321(state.bills);
}
async function importBackupFileV410(file){
  if(!file)return;let parsed;
  try{parsed=JSON.parse(await file.text())}catch{return alert("O arquivo escolhido não é um JSON válido.")}
  if(!parsed?.data||!Array.isArray(parsed.data.bills))return alert("Este arquivo não parece ser um backup válido.");
  if(!confirm(`Importar o backup de ${parsed.exportedAt?new Date(parsed.exportedAt).toLocaleString("pt-BR"):"data desconhecida"}?\n\nTodos os dados atuais serão substituídos.`))return;
  const old=structuredClone(state);
  try{
    state=structuredClone(parsed.data);normalizeImportedStateV410();state.updatedAt=new Date().toISOString();
    const {error}=await sb.from("finance_state").update({data:structuredClone(state),updated_at:state.updatedAt}).eq("household_id",householdId);
    if(error)throw error;render();await uploadAutomaticBackupV410({force:true,silent:true});toast("Backup importado com sucesso");
  }catch(error){state=old;render();fatalDiagnostic313("Importar backup 4.1.0",error);alert(`Não foi possível importar:\n\n${error?.message||String(error)}`)}
}
async function persist(successMessage){
  try{if(state)state.dailyGoal=calculateFixedWorkdayGoal321(state.bills||[])}catch(error){fatalDiagnostic313("Recalcular meta fixa antes de salvar",error)}
  const stableScrollY=window.scrollY;
  closeKeyboardAndResetViewport(false);
  state.updatedAt=new Date().toISOString();
  render();
  requestAnimationFrame(()=>window.scrollTo({top:stableScrollY,left:0,behavior:"instant"}));
  const payload=structuredClone(state);
  const {error}=await sb.from("finance_state").update({data:payload,updated_at:payload.updatedAt}).eq("household_id",householdId);
  if(error){
    toast("Falha ao sincronizar. Tentando novamente…");
    setTimeout(async()=>{
      const retry=await sb.from("finance_state").update({data:payload,updated_at:new Date().toISOString()}).eq("household_id",householdId);
      if(!retry.error)uploadAutomaticBackupV410({force:true,silent:true}).catch(()=>{});
      toast(retry.error?"Não foi possível sincronizar":"Sincronizado");
    },1200);
  }else{
    uploadAutomaticBackupV410({force:true,silent:true}).catch(()=>{});
    if(successMessage)toast(successMessage);
  }
}
function subscribe(){
  if(channel)sb.removeChannel(channel);
  channel=sb.channel("clean-"+householdId).on("postgres_changes",
    {event:"UPDATE",schema:"public",table:"finance_state",filter:`household_id=eq.${householdId}`},
    payload=>{state=payload.new.data;render();toast("Atualizado pelo outro celular")}).subscribe();
}

function normalizeUsername(value){
  return String(value||"").trim().toLowerCase().replace(/[^a-z0-9._-]/g,"");
}
function setAuthLoading(loading){
  const button=$("loginBtn");
  if(!button)return;
  button.disabled=loading;
  button.textContent=loading?"Entrando…":"Entrar";
}
function authMessage(error){
  const message=String(error?.message||"").toLowerCase();
  if(message.includes("email not confirmed")||message.includes("not confirmed")){
    return "Confirme o e-mail enviado pelo Supabase antes de entrar.";
  }
  if(message.includes("invalid login")||message.includes("invalid credentials")){
    return "E-mail ou senha incorretos.";
  }
  if(message.includes("rate limit")){
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  return error?.message||"Não foi possível entrar.";
}
async function handleLogin(){
  feedback("authMsg","");
  clearFatalDiagnostic313();
  const email=$("email").value.trim().toLowerCase();
  const password=$("password").value;

  if(!email||!email.includes("@")){
    feedback("authMsg","Digite o seu e-mail completo.");
    $("email").focus();
    return;
  }
  if(!password){
    feedback("authMsg","Digite sua senha.");
    $("password").focus();
    return;
  }

  setAuthLoading(true);

  let authData;
  try{
    const response=await sb.auth.signInWithPassword({email,password});
    if(response.error){
      console.warn("Supabase Auth:",response.error);
      feedback("authMsg",authMessage(response.error));
      return;
    }
    authData=response.data;
  }catch(error){
    console.error("Falha de rede no Auth:",error);
    feedback("authMsg",navigator.onLine
      ?"Não foi possível alcançar o servidor de login agora."
      :"Sem conexão com a internet.");
    return;
  }finally{
    setAuthLoading(false);
  }

  if(!authData?.session?.user){
    feedback("authMsg","O login foi aceito, mas a sessão não foi criada.");
    return;
  }

  localStorage.setItem("nosso-controle-email",email);
  user=authData.session.user;
  closeKeyboardAndResetViewport(true);

  try{
    await loadMembership();
  }catch(error){
    console.error("Falha após login:",error);
    fatalDiagnostic313("Abrir dados após login",error,{
      user_id:user?.id||"—",
      household_id:householdId||"—"
    });
    feedback("authMsg","Login realizado, mas ocorreu um erro ao abrir seus dados.");
    show("authView");
  }
}

$("loginBtn").onclick=event=>{
  event.preventDefault();
  handleLogin();
};
$("password").addEventListener("keydown",event=>{
  if(event.key==="Enter"){
    event.preventDefault();
    handleLogin();
  }
});
$("signupBtn").onclick=()=>{
  feedback("signupMsg","");
  $("signupEmail").value=$("email").value.includes("@")?$("email").value.trim().toLowerCase():"";
  $("signupPassword").value="";
  $("signupPasswordConfirm").value="";
  try{$("signupDialog").showModal()}catch{$("signupDialog").setAttribute("open","")}
};

$("createAccountBtn").onclick=async()=>{
  feedback("signupMsg","");
  const email=$("signupEmail").value.trim().toLowerCase();
  const password=$("signupPassword").value;
  const confirm=$("signupPasswordConfirm").value;

  if(!email.includes("@"))return feedback("signupMsg","Digite um e-mail válido.");
  if(password.length<6)return feedback("signupMsg","A senha precisa ter pelo menos 6 caracteres.");
  if(password!==confirm)return feedback("signupMsg","As senhas não são iguais.");

  const button=$("createAccountBtn");
  button.disabled=true;
  button.textContent="Criando…";

  try{
    const {data,error}=await sb.auth.signUp({
      email,
      password,
      options:{emailRedirectTo:`${location.origin}${location.pathname}`}
    });

    if(error){
      const text=String(error.message||"").toLowerCase();
      if(text.includes("already registered")||text.includes("already been registered")){
        feedback("signupMsg","Este e-mail já possui conta. Use Entrar ou Esqueci minha senha.");
      }else{
        feedback("signupMsg",error.message);
      }
      return;
    }

    localStorage.setItem("nosso-controle-email",email);
    $("email").value=email;

    if(data?.session?.user){
      user=data.session.user;
      try{$("signupDialog").close()}catch{}
      await loadMembership();
      return;
    }

    feedback("signupMsg","Conta criada. Confirme o e-mail recebido e depois entre com e-mail e senha.");
  }catch(error){
    feedback("signupMsg",navigator.onLine
      ? (error?.message||"Não foi possível criar a conta.")
      : "Sem conexão com a internet.");
  }finally{
    button.disabled=false;
    button.textContent="Criar minha conta";
  }
};

$("forgotPasswordBtn").onclick=()=>{
  feedback("resetMsg","");
  $("resetEmail").value=$("email").value.includes("@")?$("email").value.trim():localStorage.getItem("nosso-controle-email")||"";
  try{$("resetPasswordDialog").showModal()}catch{$("resetPasswordDialog").setAttribute("open","")}
};
$("sendResetBtn").onclick=async()=>{
  feedback("resetMsg","");
  const email=$("resetEmail").value.trim().toLowerCase();
  if(!email.includes("@"))return feedback("resetMsg","Digite o e-mail da conta.");
  const button=$("sendResetBtn");button.disabled=true;button.textContent="Enviando…";
  try{
    const redirectTo=`${location.origin}${location.pathname}`;
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo});
    feedback("resetMsg",error?error.message:"Link enviado. Verifique também a pasta de spam.");
  }catch(error){feedback("resetMsg",error?.message||"Não foi possível enviar o link.")}
  finally{button.disabled=false;button.textContent="Enviar link"}
};


function openNewPasswordDialog(){
  feedback("newPasswordMsg","");
  $("newPassword").value="";
  $("newPasswordConfirm").value="";
  try{$("newPasswordDialog").showModal()}catch{$("newPasswordDialog").setAttribute("open","")}
}

$("saveNewPasswordBtn").onclick=async()=>{
  feedback("newPasswordMsg","");
  const password=$("newPassword").value;
  const confirm=$("newPasswordConfirm").value;

  if(password.length<6)return feedback("newPasswordMsg","A senha precisa ter pelo menos 6 caracteres.");
  if(password!==confirm)return feedback("newPasswordMsg","As senhas não são iguais.");

  const button=$("saveNewPasswordBtn");
  button.disabled=true;
  button.textContent="Salvando…";

  try{
    const {error}=await sb.auth.updateUser({password});
    if(error){
      feedback("newPasswordMsg",error.message);
      return;
    }
    feedback("newPasswordMsg","Senha atualizada. Você já pode entrar.");
    setTimeout(async()=>{
      try{$("newPasswordDialog").close()}catch{}
      await sb.auth.signOut();
      show("authView");
      $("password").value="";
      feedback("authMsg","Senha alterada. Entre usando o e-mail e a nova senha.");
    },900);
  }catch(error){
    feedback("newPasswordMsg",error?.message||"Não foi possível salvar a nova senha.");
  }finally{
    button.disabled=false;
    button.textContent="Salvar nova senha";
  }
};

sb.auth.onAuthStateChange(async(event,session)=>{
  if(event==="PASSWORD_RECOVERY"){
    user=session?.user||null;
    setTimeout(openNewPasswordDialog,0);
    return;
  }
  if(event==="SIGNED_IN" && session?.user){
    user=session.user;
  }
  if(event==="SIGNED_OUT"){
    user=null;
    householdId=null;
    householdCode=null;
    state=null;
  }
});

$("createHouseholdBtn").onclick=async()=>{
  const c=makeCode();
  const {data:h,error}=await sb.from("households").insert({code:c,owner_id:user.id}).select().single();
  if(error)return feedback("householdMsg",error.message);
  const a=await sb.from("household_members").insert({household_id:h.id,user_id:user.id});
  const b=await sb.from("finance_state").insert({household_id:h.id,data:initialState});
  if(a.error||b.error)return feedback("householdMsg","Não foi possível criar o grupo.");
  householdId=h.id;householdCode=c;state=structuredClone(initialState);subscribe();show("appView");render();
};
$("joinHouseholdBtn").onclick=async()=>{
  const c=$("joinCode").value.trim().toUpperCase();
  const {data:h}=await sb.from("households").select("id,code").eq("code",c).maybeSingle();
  if(!h)return feedback("householdMsg","Código não encontrado.");
  const {error}=await sb.from("household_members").insert({household_id:h.id,user_id:user.id});
  if(error)return feedback("householdMsg",error.message);
  householdId=h.id;householdCode=h.code;await loadState();subscribe();show("appView");
};



function renderAdminPanel(){
  if(!state)return;
  $("adminBillsCount").textContent=String((state.bills||[]).filter(b=>!b.completed).length);
  $("adminIncomeCount").textContent=String((state.incomes||[]).length);
  $("adminExpenseCount").textContent=String((state.expenses||[]).length);
  $("adminVaultCount").textContent=String((state.vaultEntries||[]).length);
  $("adminDailyGoal").value=Number(state.dailyGoal||70);
  $("adminDisplayName").value=state.displayName||"Lucas";
}
function openAdminPanel(){
  $("settingsSheet").classList.add("hidden");
  renderAdminPanel();
  $("adminDialog").showModal();
}
function exportStateBackup(){
  const exportData={
    app:"Nosso Controle",
    version:"11",
    exportedAt:new Date().toISOString(),
    householdCode,
    data:state
  };
  const blob=new Blob([JSON.stringify(exportData,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=`nosso-controle-backup-${currentLocalDate()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast("Backup preparado");
}

function frequencyLabel(value){
  return ({once:"Única",weekly:"Semanal",biweekly:"Quinzenal",monthly:"Mensal",yearly:"Anual"})[value]||"Mensal";
}
function advanceDueDate(dateString,frequency){
  const [y,m,d]=dateString.split("-").map(Number);
  const date=new Date(y,m-1,d,12,0,0);
  if(frequency==="weekly")date.setDate(date.getDate()+7);
  else if(frequency==="biweekly")date.setDate(date.getDate()+14);
  else if(frequency==="yearly")date.setFullYear(date.getFullYear()+1);
  else if(frequency==="monthly"){
    const originalDay=date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth()+1);
    const last=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
    date.setDate(Math.min(originalDay,last));
  }
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function groupBills(bills){
  const now=new Date();now.setHours(0,0,0,0);
  const in7=[],thisMonth=[],installments=[],other=[];
  for(const b of bills){
    const days=daysUntil(b.due);
    if(b.type==="installment")installments.push(b);
    else if(days<=7)in7.push(b);
    else{
      const d=new Date(b.due+"T12:00:00");
      if(d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear())thisMonth.push(b);
      else other.push(b);
    }
  }
  return [
    {title:"Vencem nos próximos 7 dias",items:in7},
    {title:"Vencem neste mês",items:thisMonth},
    {title:"Parceladas",items:installments},
    {title:"Outras",items:other}
  ].filter(g=>g.items.length);
}

function render(){
  if(!state)return;
  const hour=new Date().getHours();
  $("greeting").textContent=hour<12?"BOM DIA":hour<18?"BOA TARDE":"BOA NOITE";
  $("displayNameText").textContent=state.displayName||"Lucas";
  const active=state.bills.filter(b=>!b.paid);
  const target=active.reduce((s,b)=>s+b.amount,0);
  const covered=active.reduce((s,b)=>s+Math.min(b.reserved,b.amount),0);
  const missing=active.reduce((s,b)=>s+Math.max(0,b.amount-b.reserved),0);
  const pct=target?Math.min(100,covered/target*100):100;

  $("cashTotal").textContent=money(state.cash);
  $("cardTotal").textContent=money(state.card);
  animateMoney("totalReserved",state.cash+state.card);
  $("monthlyTarget").textContent=money(target);
  $("missingTotal").textContent=money(missing);
  $("overallBadge").textContent=pct.toFixed(1).replace(".",",")+"%";
  $("overallBar").style.width=pct+"%";
  $("groupCodeText").textContent=householdCode;

  const nearest=active.slice().sort((a,b)=>new Date(a.due)-new Date(b.due))[0];
  if(!nearest)$("dailyMessage").textContent="Todas as contas abertas já estão cobertas. Parabéns!";
  else{
    const d=daysUntil(nearest.due),left=Math.max(0,nearest.amount-nearest.reserved);
    $("dailyMessage").textContent=`${nearest.name}: faltam ${d<0?0:d} dias e ${money(left)} para completar.`;
  }

  $("billSelect").innerHTML='<option value="auto">Distribuir pelas contas mais próximas</option>'+active.map(b=>`<option value="${b.id}">${b.name}</option>`).join("");
  $("billList").innerHTML="";
  const activeBills=state.bills.filter(b=>!b.completed).slice().sort((a,b)=>new Date(a.due)-new Date(b.due));
  const groups=groupBills(activeBills);
  for(const group of groups){
    const title=document.createElement("div");
    title.className="bill-group-title";
    title.innerHTML=`<span>${group.title}</span><span class="bill-group-count">${group.items.length}</span>`;
    $("billList").appendChild(title);

    group.items.forEach((b,i)=>{
      const d=daysUntil(b.due),remain=Math.max(0,b.amount-b.reserved),p=b.amount?Math.min(100,b.reserved/b.amount*100):100;
      let tone="",txt=d<0?`Vencida há ${Math.abs(d)} dias`:d===0?"Vence hoje":`${d} dias`;
      if(d<=7)tone=d<=0?"danger":"warning";
      const el=document.createElement("article");el.className="bill-card";el.style.animationDelay=(i*.04)+"s";
      const installmentHtml=b.type==="installment"?`
        <div class="installment-progress">
          <div class="installment-progress-head"><span>Parcelamento</span><b>${b.currentInstallment}/${b.totalInstallments}</b></div>
          <div class="installment-progress-track"><i style="width:${Math.min(100,(b.currentInstallment/b.totalInstallments)*100)}%"></i></div>
        </div>`:"";
      el.innerHTML=`<div class="bill-main">
        <div class="bill-illustration ${classes[b.id]||"council"}">${icons[b.id]||"📄"}</div>
        <div class="bill-info">
          <div class="bill-name">${b.name}</div>
          <div class="bill-due">Vence em ${formatDate(b.due)} · total ${money(b.amount)}</div>
          <span class="bill-frequency-badge">${frequencyLabel(b.frequency)}</span>
        </div>
        <span class="days-pill ${tone}">${txt}</span>
      </div>
      <div class="bill-values">
        <div class="reserved-box"><span>Reservado</span><b>${money(b.reserved)}</b></div>
        <div class="remaining-box"><span>Ainda falta</span><b>${money(remain)}</b></div>
      </div>
      <div class="bill-progress"><i style="width:${p}%"></i></div>
      ${installmentHtml}
      <div class="bill-actions">
        <button class="small-button edit" data-id="${b.id}">Editar</button>
        <button class="small-button pay" data-id="${b.id}">Marcar paga</button>
      </div>`;
      $("billList").appendChild(el);
    });
  }
  document.querySelectorAll(".edit").forEach(x=>x.onclick=()=>openBillCreateDialog(x.dataset.id));
  document.querySelectorAll(".pay").forEach(x=>x.onclick=()=>togglePaid(x.dataset.id));

  const history=(state.history||[]).slice().reverse().slice(0,12);
  $("historyList").innerHTML=history.length?history.map(h=>{
    const historyAmount=h.type==="bill_payment"?(Number(h.amount)||0):((Number(h.cash)||0)+(Number(h.card)||0));
    return `<div class="history-item"><div><b>${h.text||h.label}</b><small>${new Date(h.date).toLocaleString("pt-BR")}${h.bill?" · "+h.bill:""}</small></div><strong>${money(historyAmount)}</strong></div>`;
  }).join(""):'<div class="history-item"><span>Nenhum lançamento ainda.</span></div>';
  renderOverview();
  renderExpenses();
  renderVault();
  if($("calendarDialog")?.open)renderCalendar();
}




function startOfWeek(date=new Date()){
  const d=new Date(date);d.setHours(12,0,0,0);
  const day=(d.getDay()+6)%7;
  d.setDate(d.getDate()-day);
  return d;
}
function dateKeyFromDate(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function currentWeekItems(items){
  const start=startOfWeek(),end=new Date(start);end.setDate(end.getDate()+7);
  return (items||[]).filter(x=>{
    if(!x.date)return false;
    const d=new Date(x.date+"T12:00:00");
    return d>=start&&d<end;
  });
}
function monthKeyFromDateValue(value){
  const d=new Date(value.includes("T")?value:value+"T12:00:00");
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
function lastMonths(count=6){
  const result=[],now=new Date();
  for(let i=count-1;i>=0;i--){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1,12);
    result.push({
      key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,
      label:new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(d).replace(".","")
    });
  }
  return result;
}
function billPaymentsForMonth(key){
  return (state.history||[]).filter(h=>h.type==="bill_payment"&&monthKeyFromDateValue(h.date)===key)
    .reduce((s,h)=>s+Number(h.amount||0),0);
}
function monthlyFinancialSeries(){
  return lastMonths(6).map(m=>{
    const income=(state.incomes||[]).filter(x=>monthKeyFromDateValue(x.date)===m.key).reduce((s,x)=>s+Number(x.amount||0),0);
    const expenses=(state.expenses||[]).filter(x=>monthKeyFromDateValue(x.date)===m.key).reduce((s,x)=>s+Number(x.amount||0),0);
    const vault=(state.vaultEntries||[]).filter(x=>monthKeyFromDateValue(x.date)===m.key).reduce((s,x)=>s+Number(x.amount||0),0);
    const bills=billPaymentsForMonth(m.key);
    return {...m,income,expenses,vault,bills,wealth:income-expenses-bills};
  });
}
function renderWealthChart(series){
  const el=$("wealthChart"),labels=$("wealthChartLabels");
  if(!el||!labels)return;
  const values=series.map(x=>x.wealth);
  const min=Math.min(0,...values),max=Math.max(1,...values);
  const width=600,height=150,pad=12,range=Math.max(1,max-min);
  const points=values.map((v,i)=>{
    const x=pad+i*((width-pad*2)/Math.max(1,values.length-1));
    const y=height-pad-((v-min)/range)*(height-pad*2);
    return {x,y,v};
  });
  const line=points.map(p=>`${p.x},${p.y}`).join(" ");
  const area=`${points[0].x},${height-pad} ${line} ${points[points.length-1].x},${height-pad}`;
  const grid=[.25,.5,.75].map(n=>`<line class="chart-grid-line" x1="0" x2="${width}" y1="${height*n}" y2="${height*n}"/>`).join("");
  const circles=points.map((p,i)=>`<circle class="wealth-point" style="animation-delay:${.55+i*.08}s" cx="${p.x}" cy="${p.y}" r="4"><title>${series[i].label}: ${money(p.v)}</title></circle>`).join("");
  el.innerHTML=`<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
    <defs><linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity=".32"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </linearGradient></defs>
    ${grid}<polygon class="wealth-area" points="${area}"/><polyline class="wealth-line" points="${line}"/>${circles}
  </svg>`;
  labels.innerHTML=series.map(x=>`<span>${x.label}</span>`).join("");
  const first=values[0]||0,last=values[values.length-1]||0;
  const diff=last-first;
  $("trendBadge").textContent=diff===0?"Estável":`${diff>0?"↑":"↓"} ${money(Math.abs(diff))}`;
  $("trendBadge").style.color=diff>=0?"var(--green)":"var(--red)";
}
function renderWeeklyIncomeChart(){
  const start=startOfWeek(),names=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],today=currentLocalDate();
  const values=[];
  for(let i=0;i<7;i++){
    const d=new Date(start);d.setDate(start.getDate()+i);
    const key=dateKeyFromDate(d);
    const value=(state.incomes||[]).filter(x=>x.date===key).reduce((s,x)=>s+Number(x.amount||0),0);
    values.push({key,label:names[i],value});
  }
  const max=Math.max(1,...values.map(x=>x.value));
  $("weeklyIncomeChart").innerHTML=values.map(x=>`
    <div class="week-bar-column ${x.key===today?"today":""}">
      <b>${x.value?money(x.value):"--"}</b>
      <div class="week-bar-track"><i class="week-bar-fill" data-height="${Math.max(x.value?8:0,(x.value/max)*100)}"></i></div>
      <span>${x.label}</span>
    </div>`).join("");
  requestAnimationFrame(()=>document.querySelectorAll(".week-bar-fill").forEach(x=>x.style.height=x.dataset.height+"%"));
}
function renderMoneyDonut(bills,expenses,vault,free,income){
  const total=Math.max(income,bills+expenses+vault+Math.max(0,free),.01);
  const bp=Math.max(0,bills/total*100),ep=Math.max(0,expenses/total*100),vp=Math.max(0,vault/total*100),fp=Math.max(0,100-bp-ep-vp);
  const bEnd=bp,eEnd=bEnd+ep,vEnd=eEnd+vp;
  $("moneyDonut").style.background=`conic-gradient(
    var(--purple) 0 ${bEnd}%,
    #f06dad ${bEnd}% ${eEnd}%,
    var(--blue) ${eEnd}% ${vEnd}%,
    var(--green) ${vEnd}% 100%)`;
  $("donutCenter").textContent=money(total).replace(",00","");
  $("donutBills").textContent=bp.toFixed(0)+"%";
  $("donutExpenses").textContent=ep.toFixed(0)+"%";
  $("donutVault").textContent=vp.toFixed(0)+"%";
  $("donutFree").textContent=fp.toFixed(0)+"%";
}
function showDayDetails(key){
  const incomeItems=(state.incomes||[]).filter(x=>x.date===key);
  const expenseItems=(state.expenses||[]).filter(x=>x.date===key);
  const vaultItems=(state.vaultEntries||[]).filter(x=>x.date===key);
  const billItems=(state.history||[]).filter(x=>x.type==="bill_payment"&&localDateKey(x.date)===key);
  const deposits=(state.history||[]).filter(x=>x.type!=="bill_payment"&&x.date&&localDateKey(x.date)===key&&((Number(x.cash)||0)+(Number(x.card)||0)>0));
  const income=sumItems(incomeItems),expenses=sumItems(expenseItems),vault=sumItems(vaultItems);
  const bills=billItems.reduce((s,x)=>s+Number(x.amount||0),0);
  const net=income-expenses-bills-vault;
  const date=new Date(key+"T12:00:00");
  $("dayDetailsTitle").textContent=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(date);
  $("dayDetailIncome").textContent=money(income);
  $("dayDetailExpenses").textContent=money(expenses);
  $("dayDetailBills").textContent=money(bills);
  $("dayDetailVault").textContent=money(vault);
  $("dayDetailNet").textContent=money(net);
  $("dayDetailNet").closest(".day-net-card").classList.toggle("negative",net<0);
  const rows=[
    ...incomeItems.map(x=>({label:x.description||"Receita",sub:"Receita",amount:x.amount,type:"income",sign:"+"})),
    ...expenseItems.map(x=>({label:x.description||expenseNames[x.category]||"Gasto",sub:expenseNames[x.category]||"Gasto",amount:x.amount,type:"expense",sign:"−"})),
    ...billItems.map(x=>({label:x.bill||x.text||"Bill paga",sub:"Bill paga",amount:x.amount,type:"bills",sign:"−"})),
    ...vaultItems.map(x=>({label:x.description||"Cofre",sub:(x.location||"envelope")==="card"?"Cofre · Cartão":"Cofre · Envelope",amount:x.amount,type:"vault",sign:"−"})),
    ...deposits.map(x=>({label:x.text||x.label||"Depósito para Bills",sub:"Reserva para Bills",amount:(Number(x.cash)||0)+(Number(x.card)||0),type:"bills",sign:""}))
  ];
  $("dayDetailsList").innerHTML=rows.length?rows.map(x=>`<article class="day-detail-item">
    <div><b>${x.label}</b><small>${x.sub}</small></div><strong class="${x.type}">${x.sign}${money(x.amount)}</strong>
  </article>`).join(""):'<div class="empty-state">Nenhuma movimentação neste dia.</div>';
  $("dayDetailsDialog").showModal();
}

function isInCurrentMonth(dateValue){
  const d=new Date(`${dateValue}T12:00:00`),now=new Date();
  return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();
}
function currentMonthItems(items){
  return (items||[]).filter(x=>x.date&&isInCurrentMonth(x.date));
}
function sumItems(items){
  return (items||[]).reduce((sum,item)=>sum+Number(item.amount||0),0);
}
function renderOverview(){
  if(!state)return;
  state.incomes=Array.isArray(state.incomes)?state.incomes:[];
  state.expenses=Array.isArray(state.expenses)?state.expenses:[];
  state.vaultEntries=Array.isArray(state.vaultEntries)?state.vaultEntries:[];

  const incomeMonth=currentMonthItems(state.incomes);
  const expensesMonth=currentMonthItems(state.expenses);
  const vaultMonth=currentMonthItems(state.vaultEntries);

  const income=sumItems(incomeMonth);
  const weekIncome=sumItems(currentWeekItems(state.incomes));
  const expenses=sumItems(expensesMonth);
  const vault=sumItems(vaultMonth);
  const vaultEnvelope=sumItems(vaultMonth.filter(x=>(x.location||"envelope")==="envelope"));
  const vaultCard=sumItems(vaultMonth.filter(x=>x.location==="card"));
  const bills=state.bills.filter(b=>!b.paid).reduce((sum,b)=>sum+Number(b.reserved||0),0);

  const todayKey=currentLocalDate();
  const todayIncome=sumItems(state.incomes.filter(x=>x.date===todayKey));
  const todayExpenses=sumItems(state.expenses.filter(x=>x.date===todayKey));
  const todayVault=sumItems(state.vaultEntries.filter(x=>x.date===todayKey));
  const todayBills=(state.history||[])
    .filter(x=>x.date&&localDateKey(x.date)===todayKey&&((Number(x.cash)||0)+(Number(x.card)||0)>0))
    .reduce((sum,x)=>sum+(Number(x.cash)||0)+(Number(x.card)||0),0);
  const todayNet=todayIncome-todayExpenses-todayBills-todayVault;

  const allocated=bills+expenses+vault;
  const free=income-allocated;
  const safeIncome=Math.max(income,0.0001);
  const usedPct=income>0?Math.min(100,allocated/income*100):0;
  const freePct=income>0?Math.max(0,Math.min(100,free/income*100)):0;

  const patrimony=Math.max(0,free)+vault;
  const savingsRate=income>0?Math.max(0,Math.min(100,(vault+Math.max(0,free))/income*100)):0;
  $("premiumNetWorth").textContent=money(patrimony);
  $("premiumSavingsRate").textContent=savingsRate.toFixed(0)+"%";
  $("premiumIncome").textContent=money(income);
  $("premiumCommitted").textContent=money(bills+expenses);
  $("premiumProtected").textContent=money(vault);
  $("premiumHeroCaption").textContent=income>0?`Vocês preservaram ${savingsRate.toFixed(0)}% do que receberam.`:"Registre as receitas para acompanhar o patrimônio.";
  $("periodTodayIncome").textContent=money(todayIncome);
  $("periodWeekIncome").textContent=money(weekIncome);
  $("periodMonthIncome").textContent=money(income);

  $("overviewTodayIncome").textContent=money(todayIncome);
  $("overviewTodayExpenses").textContent=money(todayExpenses);
  $("overviewTodayBills").textContent=money(todayBills);
  $("overviewTodayVault").textContent=money(todayVault);
  $("overviewTodayNet").textContent=money(todayNet);
  $("dailyDateLabel").textContent=new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long"}).format(new Date());
  $("overviewTodayNet").closest(".daily-net")?.classList.toggle("negative",todayNet<0);

  $("overviewIncome").textContent=money(income);
  $("overviewBills").textContent=money(bills);
  $("overviewExpenses").textContent=money(expenses);
  $("overviewVault").textContent=money(vault);
  $("overviewVaultEnvelope").textContent=money(vaultEnvelope);
  $("overviewVaultCard").textContent=money(vaultCard);
  $("overviewVaultTotalSplit").textContent=money(vault);
  $("overviewFreeBalance").textContent=money(free);
  $("overviewAllocated").textContent=money(allocated);
  $("overviewUsedPercent").textContent=usedPct.toFixed(1).replace(".",",")+"%";
  $("overviewFreePercent").textContent=freePct.toFixed(1).replace(".",",")+"%";
  $("overviewNetBar").style.width=usedPct+"%";

  const billPct=income>0?Math.min(100,bills/safeIncome*100):0;
  const expPct=income>0?Math.min(100,expenses/safeIncome*100):0;
  const vaultPct=income>0?Math.min(100,vault/safeIncome*100):0;
  const unallocatedPct=Math.max(0,100-billPct-expPct-vaultPct);
  $("allocationBills").style.width=billPct+"%";
  $("allocationExpenses").style.width=expPct+"%";
  $("allocationVault").style.width=vaultPct+"%";
  $("allocationFree").style.width=unallocatedPct+"%";
  $("legendBillsPct").textContent=billPct.toFixed(1).replace(".",",")+"%";
  $("legendExpensesPct").textContent=expPct.toFixed(1).replace(".",",")+"%";
  $("legendVaultPct").textContent=vaultPct.toFixed(1).replace(".",",")+"%";
  $("legendFreePct").textContent=unallocatedPct.toFixed(1).replace(".",",")+"%";
  renderWealthChart(monthlyFinancialSeries());
  renderWeeklyIncomeChart();
  renderMoneyDonut(bills,expenses,vault,free,income);

  if(income<=0)$("overviewStatus").textContent="Adicione a primeira receita para calcular o saldo.";
  else if(free<0)$("overviewStatus").textContent=`Vocês comprometeram ${money(Math.abs(free))} acima das receitas registradas.`;
  else if(free===0)$("overviewStatus").textContent="Toda a receita registrada já foi destinada.";
  else $("overviewStatus").textContent=`Depois de bills, gastos e cofre, restam ${money(free)} livres.`;

  const list=[...state.incomes].sort((a,b)=>new Date(b.date)-new Date(a.date));
  $("incomeList").innerHTML=list.length?list.map(x=>{
    const fromRoute=x.source==="route"||x.source==="cleaning";
    return `<article class="income-item ${fromRoute?"route-income-v6":""}">
      <div class="income-icon">${fromRoute?"▦":"💷"}</div>
      <div class="income-info"><b>${x.description||"Receita"}</b><small>${fromRoute?"Rota · ":x.person==="lucas"?"Lucas · ":x.person==="namorada"?"Namorada · ":"Casal · "}${new Date(x.date+"T12:00:00").toLocaleDateString("pt-BR")}${fromRoute?` · ${x.paymentMethod==="cash"?"Dinheiro":"Cartão"}`:""}</small></div>
      <div class="income-value"><strong>+${money(x.amount)}</strong>${fromRoute?'<span class="route-sync-badge-v6">Sincronizado</span>':`<div class="row-actions"><button data-income-edit="${x.id}">Editar</button><button data-income-delete="${x.id}">Excluir</button></div>`}</div>
    </article>`;
  }).join(""):'<div class="empty-state">Nenhuma receita registrada ainda.</div>';
  document.querySelectorAll("[data-income-edit]").forEach(button=>button.onclick=()=>editIncome(button.dataset.incomeEdit));
  document.querySelectorAll("[data-income-delete]").forEach(button=>button.onclick=()=>deleteIncome(button.dataset.incomeDelete));
  renderOverviewV6();
}
function renderOverviewV6(){
  if(!state)return;
  const today=new Date();
  const monthKey=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`;
  const incomes=(state.incomes||[]).filter(x=>String(x.date||"").slice(0,7)===monthKey);
  const expenses=(state.expenses||[]).filter(x=>String(x.date||"").slice(0,7)===monthKey);
  const vaultEntries=(state.vaultEntries||[]).filter(x=>String(x.date||"").slice(0,7)===monthKey);

  const income=incomes.reduce((s,x)=>s+Number(x.amount||0),0);
  const routeIncome=incomes.filter(x=>x.source==="route"||x.source==="cleaning").reduce((s,x)=>s+Number(x.amount||0),0);
  const otherIncome=income-routeIncome;
  const expenseTotal=expenses.reduce((s,x)=>s+Number(x.amount||0),0);
  const vaultTotal=vaultEntries.reduce((s,x)=>s+Number(x.amount||0),0);
  const billsReserved=(state.bills||[]).filter(b=>!b.paid).reduce((s,b)=>s+Number(b.reserved||0),0);
  const free=income-billsReserved-expenseTotal-vaultTotal;
  const safe=Math.max(income,0.0001);

  const setMoney=(id,value)=>{const node=$(id);if(node)node.textContent=money(value);};
  const setText=(id,value)=>{const node=$(id);if(node)node.textContent=value;};

  setMoney("moneyMapIncomeV6",income);
  setMoney("moneyMapRouteIncomeV6",routeIncome);
  setMoney("moneyMapOtherIncomeV6",otherIncome);
  setMoney("moneyMapBillsV6",billsReserved);
  setMoney("moneyMapExpensesV6",expenseTotal);
  setMoney("moneyMapVaultV6",vaultTotal);
  setMoney("moneyMapFreeV6",free);

  const pct=v=>income>0?Math.max(0,Math.min(100,v/safe*100)):0;
  setText("moneyMapRoutePctV6",`${pct(routeIncome).toFixed(0)}% das receitas`);
  setText("moneyMapOtherPctV6",`${pct(otherIncome).toFixed(0)}% das receitas`);
  setText("moneyMapExpensesPctV6",`${pct(expenseTotal).toFixed(0)}% das receitas`);
  setText("moneyMapVaultPctV6",`${pct(vaultTotal).toFixed(0)}% das receitas`);
  setText("moneyMapFreePctV6",`${pct(Math.max(0,free)).toFixed(0)}% das receitas`);

  const bars=[
    ["moneyMapBillsBarV6",billsReserved],
    ["moneyMapExpensesBarV6",expenseTotal],
    ["moneyMapVaultBarV6",vaultTotal],
    ["moneyMapFreeBarV6",Math.max(0,free)]
  ];
  bars.forEach(([id,value])=>{const node=$(id);if(node)node.style.width=`${pct(value)}%`;});

  setMoney("spendingTotalV6",expenseTotal);
  const cats={};
  for(const item of expenses){
    const key=item.category||"outros";
    cats[key]=(cats[key]||0)+Number(item.amount||0);
  }
  const sortedCats=Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const top=sortedCats[0];
  setText("spendingTopCategoryV6",top?(expenseNames[top[0]]||"Outros"):"—");
  setMoney("spendingTopCategoryAmountV6",top?top[1]:0);

  const largest=[...expenses].sort((a,b)=>Number(b.amount||0)-Number(a.amount||0))[0];
  setText("spendingLargestNameV6",largest?(largest.description||expenseNames[largest.category]||"Gasto"):"—");
  setMoney("spendingLargestAmountV6",largest?largest.amount:0);
  setMoney("spendingDailyAverageV6",expenseTotal/Math.max(1,today.getDate()));

  const list=$("spendingCategoriesV6");
  if(list){
    list.innerHTML=sortedCats.length?sortedCats.slice(0,6).map(([key,value])=>{
      const share=expenseTotal>0?value/expenseTotal*100:0;
      return `<article>
        <div><span>${expenseIcons[key]||"🧾"}</span><strong>${expenseNames[key]||"Outros"}</strong></div>
        <div class="spending-cat-value-v6"><b>${money(value)}</b><small>${share.toFixed(0)}%</small></div>
        <i><em style="width:${share}%"></em></i>
      </article>`;
    }).join(""):'<div class="empty-state">Nenhum gasto registrado neste mês.</div>';
  }
}

function editIncome(id){
  const item=state.incomes.find(x=>x.id===id);
  if(!item)return;
  if(item.source==="route"||item.source==="cleaning"){
    toast("Edite este pagamento pela aba Rota.");
    return;
  }
  $("incomeEditId").value=id;
  $("incomeDialogTitle").textContent="Editar receita";
  $("incomeAmount").value=item.amount;
  $("incomeDescription").value=item.description||"";
  $("incomePerson").value=item.person||"casal";
  $("incomeDate").value=item.date;
  $("incomeDialog").showModal();
}
async function deleteIncome(id){
  const item=state.incomes.find(x=>x.id===id);
  if(item&&(item.source==="route"||item.source==="cleaning")){
    toast("Desmarque o pagamento pela aba Rota.");
    return;
  }
  if(!confirm("Excluir esta receita?"))return;
  state.incomes=state.incomes.filter(x=>x.id!==id);
  await persist("Receita excluída");
}

const expenseIcons={gasolina:"⛽",mercado:"🛒",lanche:"🍔",lazer:"🎮",casa:"⌂",carro:"🚘",saude:"✚",outros:"🧾"};
const expenseNames={gasolina:"Combustível",mercado:"Mercado",lanche:"Alimentação",lazer:"Lazer",casa:"Casa",carro:"Carro",saude:"Saúde",outros:"Outros"};

function currentLocalDate(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function renderExpenses(){
  if(!state)return;
  state.expenses=Array.isArray(state.expenses)?state.expenses:[];
  const now=new Date(),year=now.getFullYear(),month=now.getMonth();
  const monthItems=state.expenses.filter(x=>{
    const d=new Date(`${x.date}T12:00:00`);
    return d.getFullYear()===year&&d.getMonth()===month;
  });
  const total=monthItems.reduce((s,x)=>s+Number(x.amount||0),0);
  $("expenseMonthTotal").textContent=money(total);
  const cats={gasolina:0,mercado:0,lanche:0,lazer:0,casa:0,carro:0,saude:0,outros:0};
  monthItems.forEach(x=>cats[x.category]=(cats[x.category]||0)+Number(x.amount||0));
  $("expenseCategoryStrip").innerHTML=Object.entries(cats).filter(([,v])=>v>0)
    .map(([k,v])=>`<span class="category-pill">${expenseIcons[k]} ${expenseNames[k]} <b>${money(v)}</b></span>`).join("")
    ||'<span class="category-pill">Nenhum gasto neste mês</span>';
  const list=[...state.expenses].sort((a,b)=>new Date(b.date)-new Date(a.date));
  $("expenseList").innerHTML=list.length?list.map(x=>`<article class="expense-item">
    <div class="expense-icon ${x.category}">${expenseIcons[x.category]||"🧾"}</div>
    <div class="expense-info"><b>${x.description||expenseNames[x.category]||"Gasto"}</b><small>${expenseNames[x.category]||"Outros"} · ${new Date(x.date+"T12:00:00").toLocaleDateString("pt-BR")}</small></div>
    <div class="expense-value"><strong>−${money(x.amount)}</strong><div class="row-actions"><button data-expense-edit="${x.id}">Editar</button><button data-expense-delete="${x.id}">Excluir</button></div></div>
  </article>`).join(""):'<div class="empty-state">Nenhum gasto registrado ainda.</div>';
  document.querySelectorAll("[data-expense-edit]").forEach(b=>b.onclick=()=>editExpense(b.dataset.expenseEdit));
  document.querySelectorAll("[data-expense-delete]").forEach(b=>b.onclick=()=>deleteExpense(b.dataset.expenseDelete));
}
function editExpense(id){
  const item=state.expenses.find(x=>x.id===id);
  if(!item)return;
  $("expenseEditId").value=id;
  $("expenseDialogTitle").textContent="Editar gasto";
  $("expenseAmount").value=item.amount;
  $("expenseCategory").value=item.category||"outros";
  $("expenseDescription").value=item.description||"";
  $("expenseDate").value=item.date;
  $("expenseDialog").showModal();
}
async function deleteExpense(id){
  if(!confirm("Excluir este gasto?"))return;
  state.expenses=state.expenses.filter(x=>x.id!==id);
  await persist("Gasto excluído");
}
function normalizeVaultV4(){
  if(!Array.isArray(state.vaultEntries))state.vaultEntries=[];
  state.vaultEntries=state.vaultEntries.map(entry=>({
    id:entry.id||crypto.randomUUID?.()||String(Date.now()+Math.random()),
    type:entry.type==="withdrawal"?"withdrawal":"deposit",
    location:entry.location==="card"?"card":"envelope",
    amount:Number(entry.amount||0),
    description:entry.description||entry.note||"",
    date:entry.date||currentLocalDate(),
    createdAt:entry.createdAt||entry.timestamp||null,
    ...entry
  }));
}

function vaultLocationBalanceV4(location){
  normalizeVaultV4();
  return state.vaultEntries.reduce((sum,item)=>{
    if(item.location!==location)return sum;
    return sum+(item.type==="withdrawal"?-Number(item.amount||0):Number(item.amount||0));
  },0);
}

function renderVault(){
  if(!state)return;
  normalizeVaultV4();

  const envelope=vaultLocationBalanceV4("envelope");
  const card=vaultLocationBalanceV4("card");
  $("vaultBalance").textContent=money(envelope+card);
  $("vaultEnvelopeBalanceV4").textContent=money(envelope);
  $("vaultCardBalanceV4").textContent=money(card);

  const now=new Date();
  const monthItems=state.vaultEntries.filter(item=>{
    const date=new Date(`${item.date}T12:00:00`);
    return date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth();
  });

  const added=monthItems.filter(x=>x.type!=="withdrawal").reduce((s,x)=>s+Number(x.amount||0),0);
  const removed=monthItems.filter(x=>x.type==="withdrawal").reduce((s,x)=>s+Number(x.amount||0),0);
  $("vaultMonthAddedV4").textContent=money(added);
  $("vaultMonthRemovedV4").textContent=money(removed);

  const list=$("vaultList");
  const entries=state.vaultEntries
    .map((item,index)=>({...item,__index:index}))
    .sort((a,b)=>{
      const aTime=a.createdAt
        ? new Date(a.createdAt).getTime()
        : new Date(`${a.date}T12:00:00`).getTime();
      const bTime=b.createdAt
        ? new Date(b.createdAt).getTime()
        : new Date(`${b.date}T12:00:00`).getTime();

      if(bTime!==aTime)return bTime-aTime;
      return b.__index-a.__index;
    });
  if(!entries.length){
    list.innerHTML='<div class="vault-empty-v4">O Cofre ainda está vazio.</div>';
    return;
  }

  list.innerHTML=entries.map(item=>{
    const removed=item.type==="withdrawal";
    return `<article class="vault-entry-v4 ${removed?"removed":"added"}">
      <div class="vault-entry-sign-v4">${removed?"−":"+"}</div>
      <div class="vault-entry-info-v4">
        <strong>${escapeText(item.description||(removed?"Retirada do Cofre":"Valor adicionado"))}</strong>
        <small>${item.createdAt
          ? new Date(item.createdAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})
          : new Date(`${item.date}T12:00:00`).toLocaleDateString("pt-BR")} · ${item.location==="card"?"Cartão":"Envelope"}</small>
      </div>
      <div class="vault-entry-value-v4">
        <strong>${removed?"−":"+"}${money(item.amount)}</strong>
        <button type="button" data-vault-delete-v4="${item.id}" aria-label="Excluir movimentação">🗑</button>
      </div>
    </article>`;
  }).join("");

  list.querySelectorAll("[data-vault-delete-v4]").forEach(button=>{
    button.onclick=()=>deleteVaultEntryV4(button.dataset.vaultDeleteV4);
  });
}

async function deleteVaultEntryV4(id){
  const entry=(state.vaultEntries||[]).find(item=>String(item.id)===String(id));
  if(!entry||!confirm("Excluir esta movimentação do Cofre?"))return;
  const backup=structuredClone(state.vaultEntries);
  try{
    state.vaultEntries=state.vaultEntries.filter(item=>String(item.id)!==String(id));
    await persist("Movimentação do Cofre excluída");
  }catch(error){
    state.vaultEntries=backup;
    render();
    fatalDiagnostic313("Excluir movimentação do Cofre 4.0",error,{entry_id:id});
    toast("Não foi possível excluir a movimentação");
  }
}

function switchView(viewId){
  document.querySelectorAll(".app-section").forEach(x=>x.classList.remove("active-section"));
  
function openIncomeDialog(){
  $("incomeEditId").value="";
  $("incomeDialogTitle").textContent="Adicionar receita";
  $("incomeAmount").value="";
  $("incomeDescription").value="";
  $("incomePerson").value="casal";
  $("incomeDate").value=currentLocalDate();
  $("incomeDialog").showModal();
}
$("openIncome").onclick=openIncomeDialog;
$("openIncomeToday").onclick=openIncomeDialog;
$("saveIncome").onclick=async e=>{
  e.preventDefault();
  const amount=Number($("incomeAmount").value)||0;
  if(amount<=0)return toast("Digite um valor válido");
  state.incomes=Array.isArray(state.incomes)?state.incomes:[];
  const editId=$("incomeEditId").value;
  const payload={
    amount,
    description:$("incomeDescription").value.trim(),
    person:$("incomePerson").value,
    date:$("incomeDate").value||currentLocalDate()
  };
  if(editId){
    const item=state.incomes.find(x=>x.id===editId);
    if(item)Object.assign(item,payload);
  }else{
    state.incomes.push({id:crypto.randomUUID(),...payload});
  }
  $("incomeDialog").close();
  await persist(editId?"Receita atualizada":"Receita registrada");
};



function parseMoney317(value){
  if(typeof value==="number")return Number.isFinite(value)?value:0;
  if(value==null)return 0;
  let text=String(value).trim().replace(/[£\s]/g,"");
  if(text.includes(",")&&text.includes(".")){
    if(text.lastIndexOf(",")>text.lastIndexOf(".")){
      text=text.replace(/\./g,"").replace(",",".");
    }else{
      text=text.replace(/,/g,"");
    }
  }else if(text.includes(",")){
    text=text.replace(",",".");
  }
  const parsed=Number(text.replace(/[^\d.-]/g,""));
  return Number.isFinite(parsed)?parsed:0;
}

function parseBillDate317(value,bill={}){
  if(value instanceof Date&&!Number.isNaN(value.getTime())){
    return new Date(value.getFullYear(),value.getMonth(),value.getDate(),12,0,0,0);
  }

  const text=String(value||"").trim();
  let match=text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(match){
    return new Date(Number(match[1]),Number(match[2])-1,Number(match[3]),12,0,0,0);
  }

  match=text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if(match){
    return new Date(Number(match[3]),Number(match[2])-1,Number(match[1]),12,0,0,0);
  }

  const dueDay=Number(bill.dueDay||bill.day||bill.due_day||0);
  if(dueDay>0&&dueDay<=31){
    const now=new Date();
    let date=new Date(now.getFullYear(),now.getMonth(),dueDay,12,0,0,0);
    if(date<new Date(now.getFullYear(),now.getMonth(),now.getDate(),12,0,0,0)){
      date=new Date(now.getFullYear(),now.getMonth()+1,dueDay,12,0,0,0);
    }
    return date;
  }

  const native=new Date(text);
  if(!Number.isNaN(native.getTime())){
    return new Date(native.getFullYear(),native.getMonth(),native.getDate(),12,0,0,0);
  }
  return null;
}

function billAmount317(bill){
  return Math.max(0,parseMoney317(
    bill?.amount ?? bill?.total ?? bill?.value ?? bill?.price ?? 0
  ));
}

function billReserved317(bill){
  return Math.max(0,parseMoney317(
    bill?.reserved ?? bill?.saved ?? bill?.allocated ?? bill?.paidAmount ?? 0
  ));
}

function calculateDynamicDailyGoal316(bills){
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12,0,0,0);
  const source=Array.isArray(bills)?bills:[];

  const active=source
    .filter(b=>!b.completed&&!b.paid)
    .map(b=>{
      const amount=billAmount317(b);
      const reserved=billReserved317(b);
      return {
        due:parseBillDate317(b.due??b.dueDate??b.date,b),
        remaining:Math.max(0,amount-reserved),
        name:b.name||"Bill"
      };
    })
    .filter(b=>b.remaining>0)
    .sort((a,b)=>{
      if(!a.due&&!b.due)return 0;
      if(!a.due)return 1;
      if(!b.due)return -1;
      return a.due-b.due;
    });

  if(!active.length)return 0;

  let cumulativeRemaining=0;
  let requiredPerDay=0;
  let undatedRemaining=0;

  for(const bill of active){
    if(!bill.due){
      undatedRemaining+=bill.remaining;
      continue;
    }

    cumulativeRemaining+=bill.remaining;
    const daysAvailable=Math.max(
      1,
      Math.ceil((bill.due-today)/86400000)+1
    );
    requiredPerDay=Math.max(
      requiredPerDay,
      cumulativeRemaining/daysAvailable
    );
  }

  if(undatedRemaining>0){
    const lastDay=new Date(
      today.getFullYear(),
      today.getMonth()+1,
      0,
      12,0,0,0
    );
    const daysLeft=Math.max(
      1,
      Math.ceil((lastDay-today)/86400000)+1
    );
    requiredPerDay=Math.max(
      requiredPerDay,
      (cumulativeRemaining+undatedRemaining)/daysLeft
    );
  }

  return Math.ceil(requiredPerDay*100)/100;
}
function dailyGoal313(bills){
  try{
    return calculateDynamicDailyGoal316(bills);
  }catch(error){
    fatalDiagnostic313("Calcular meta diária dinâmica",error);
    return 0;
  }
}
function updateGoalPreview313(){
  try{
    const bills=(state?.bills||[]).map(b=>({...b}));
    const amount=Number($("newBillAmount")?.value)||0;
    const due=$("newBillDue")?.value||"";
    const editId=$("billCreateEditId")?.value||"";

    if(amount>0&&due){
      const old=bills.find(b=>b.id===editId);
      const draft={
        ...(old||{}),
        id:editId||"preview",
        amount,
        due,
        reserved:Number(old?.reserved||0),
        completed:false,
        paid:false
      };
      const index=bills.findIndex(b=>b.id===editId);
      if(index>=0)bills[index]=draft;
      else bills.push(draft);
    }

    const target=$("billGoalPreviewValue313");
    if(target){
      target.textContent=`${money(calculateFixedWorkdayGoal321(bills))} por dia trabalhado`;
    }
  }catch(error){
    fatalDiagnostic313("Prévia da meta fixa 3.2.1",error);
  }
}
function enhanceBills313(){
  try{
    if(!state)return;

    if($("billEnvelopeBalance")){
      $("billEnvelopeBalance").textContent=money(Number(state.cash||0));
    }
    if($("billCardBalance")){
      $("billCardBalance").textContent=money(Number(state.card||0));
    }

    updateFixedGoalCards321(state.bills||[]);
  }catch(error){
    fatalDiagnostic313("Atualizar meta fixa e valor guardado",error);
  }
}

$("openNewBill").onclick=()=>openBillCreateDialog();
$("newBillType").onchange=()=>{$("installmentFields").classList.toggle("hidden",$("newBillType").value!=="installment");updateGoalPreview313()};
["newBillAmount","newBillDue","newBillFrequency"].forEach(id=>$(id)?.addEventListener("input",updateGoalPreview313));
$("saveNewBill").onclick=async e=>{
  e.preventDefault();
  const name=$("newBillName").value.trim();
  const amount=Number($("newBillAmount").value)||0;
  const due=$("newBillDue").value;
  if(!name||amount<=0||!due)return toast("Preencha nome, valor e vencimento");

  const type=$("newBillType").value;
  const payload={
    name,
    amount,
    due,
    frequency:$("newBillFrequency").value,
    type,
    currentInstallment:type==="installment"?Math.max(1,Number($("newBillCurrentInstallment").value)||1):null,
    totalInstallments:type==="installment"?Math.max(1,Number($("newBillTotalInstallments").value)||1):null,
    completed:false
  };

  const editId=$("billCreateEditId").value;
  if(editId){
    const bill=state.bills.find(x=>x.id===editId);
    if(bill)Object.assign(bill,payload);
  }else{
    state.bills.push({
      id:`bill_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      reserved:0,
      paid:false,
      ...payload
    });
  }
  try{state.dailyGoal=dailyGoal313(state.bills||[])}catch(error){fatalDiagnostic313("Salvar nova meta diária",error)}
  $("billCreateDialog").close();
  await persist(editId?"Bill atualizada":"Bill adicionada");
};
$("openCompletedBills").onclick=()=>{
  $("settingsSheet").classList.add("hidden");
  renderCompletedBills();
  $("completedBillsDialog").showModal();
};
$("closeCompletedBills").onclick=()=>$("completedBillsDialog").close();


$("openUpdatesPanel").onclick=()=>{
  $("settingsSheet").classList.add("hidden");
  $("updatesDialog").showModal();
};
$("closeUpdatesPanel").onclick=()=>$("updatesDialog").close();
$("openAdminPanel").onclick=openAdminPanel;
$("closeAdminPanel").onclick=()=>$("adminDialog").close();
$("saveAdminSettings").onclick=async()=>{
  const goal=Number($("adminDailyGoal").value);
  const name=$("adminDisplayName").value.trim();
  if(!Number.isFinite(goal)||goal<0)return toast("Digite uma meta válida");
  state.dailyGoal=goal;
  state.displayName=name||"Lucas";
  await persist("Configurações atualizadas");
  renderAdminPanel();
};
document.querySelectorAll("[data-admin-view]").forEach(button=>{
  button.onclick=()=>{
    $("adminDialog").close();
    switchView(button.dataset.adminView);
  };
});
$("exportBackup").onclick=exportStateBackup;

document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
  $(viewId).classList.add("active-section");
  document.querySelector(`.nav-item[data-view="${viewId}"]`)?.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

function localDateKeyV410(value){
  if(!value)return "";const text=String(value),iso=text.match(/^(\d{4})-(\d{2})-(\d{2})/);if(iso)return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const d=new Date(value);if(Number.isNaN(d.getTime()))return "";return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function localDateKey(value){
  return localDateKeyV410(value);
}

function billDepositEntriesV410(){return (state?.history||[]).filter(item=>{const type=String(item?.type||""),text=String(item?.text||"").toLowerCase(),amount=Number(item?.amount||0)||(Number(item?.cash||0)+Number(item?.card||0));return amount>0&&item?.date&&(type==="bill_deposit"||text.includes("depósito adicionado")||text.includes("depósito editado"))})}
function depositTotalsByDayV410(){const totals={};for(const item of billDepositEntriesV410()){const key=localDateKeyV410(item.date);if(!key)continue;totals[key]=(totals[key]||0)+(Number(item.amount||0)||(Number(item.cash||0)+Number(item.card||0)))}return totals}
function renderCalendar(){
  if(!state)return;const year=calendarDate.getFullYear(),month=calendarDate.getMonth(),first=new Date(year,month,1,12),last=new Date(year,month+1,0,12),totals=depositTotalsByDayV410(),goal=calculateFixedWorkdayGoal321(state.bills||[]);
  $("calendarMonthLabel").textContent=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(first);$("calendarDailyGoalV410").textContent=money(goal);
  let monthTotal=0,goalDays=0,depositDays=0;const grid=$("calendarGrid");grid.innerHTML="";
  for(let i=0;i<first.getDay();i++){const blank=document.createElement("div");blank.className="calendar-day blank";grid.appendChild(blank)}
  for(let day=1;day<=last.getDate();day++){
    const key=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`,date=new Date(year,month,day,12),weekend=[0,6].includes(date.getDay()),amount=totals[key]||0,met=goal>0&&amount>=goal;
    monthTotal+=amount;if(amount>0)depositDays++;if(met)goalDays++;
    const cell=document.createElement("button");cell.type="button";cell.className=["calendar-day",amount>0?(met?"goal":"partial"):"",key===currentLocalDate()?"today":"",weekend?"weekend-v410":""].filter(Boolean).join(" ");
    cell.innerHTML=`<span class="calendar-day-number">${day}</span>${met?'<span class="calendar-goal-check">✓</span>':""}<span class="calendar-day-amount">${amount>0?money(amount):"--"}</span>`;
    cell.onclick=()=>showDayDetailsV410(key);grid.appendChild(cell);
  }
  $("calendarMonthTotal").textContent=money(monthTotal);$("calendarDepositDaysV410").textContent=String(depositDays);$("calendarGoalDays").textContent=String(goalDays);
}
function showDayDetailsV410(key){
  const entries=billDepositEntriesV410().filter(x=>localDateKeyV410(x.date)===key).sort((a,b)=>new Date(b.updatedAt||b.date)-new Date(a.updatedAt||a.date)),total=entries.reduce((s,x)=>s+(Number(x.amount||0)||(Number(x.cash||0)+Number(x.card||0))),0);
  $("dayDetailsTitle").textContent=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long"}).format(new Date(`${key}T12:00:00`));
  $("dayDetailIncome").textContent=money(0);$("dayDetailExpenses").textContent=money(0);$("dayDetailBills").textContent=money(total);$("dayDetailVault").textContent=money(0);$("dayDetailNet").textContent=money(total);
  $("dayDetailsList").innerHTML=entries.length?entries.map(x=>`<article class="day-detail-item"><div><b>${escapeText(x.bill||"Depósito para Bills")}</b><small>Envelope ${money(Number(x.cash||0))} · Cartão ${money(Number(x.card||0))}</small></div><strong class="income">+${money(Number(x.amount||0)||(Number(x.cash||0)+Number(x.card||0)))}</strong></article>`).join(""):'<div class="empty-state">Nenhum depósito para Bills neste dia.</div>';
  $("dayDetailsDialog").showModal();
}
function openCalendar(){$("settingsSheet").classList.add("hidden");calendarDate=new Date();renderCalendar();$("calendarDialog").showModal()}

function animateMoney(id,to){
  const el=$(id),from=Number(el.dataset.money||0),start=performance.now(),duration=500;
  function frame(now){const p=Math.min(1,(now-start)/duration),v=from+(to-from)*(1-Math.pow(1-p,3));el.textContent=money(v);if(p<1)requestAnimationFrame(frame);else el.dataset.money=to}
  requestAnimationFrame(frame);
}
function allocateDepositV404(value,id){
  let left=Math.max(0,Number(value||0));
  const allocations=[];

  const targets=id==="auto"
    ? (state.bills||[])
        .filter(b=>!b.paid&&!b.completed)
        .slice()
        .sort((a,b)=>new Date(a.due)-new Date(b.due))
    : [(state.bills||[]).find(b=>String(b.id)===String(id))];

  for(const bill of targets){
    if(!bill||left<=0)break;
    const room=Math.max(0,Number(bill.amount||0)-Number(bill.reserved||0));
    const used=Math.min(left,room);
    if(used<=0)continue;

    bill.reserved=Number(bill.reserved||0)+used;
    allocations.push({billId:String(bill.id),amount:used});
    left-=used;
  }

  return allocations;
}

function reverseDepositAllocationsV404(entry){
  const total=Math.max(0,Number(entry.cash||0)+Number(entry.card||0));
  const exact=Array.isArray(entry.allocations)&&entry.allocations.length
    ? entry.allocations
    : null;

  if(exact){
    for(const allocation of exact){
      const bill=(state.bills||[]).find(b=>String(b.id)===String(allocation.billId));
      if(!bill)continue;
      bill.reserved=Math.max(0,Number(bill.reserved||0)-Number(allocation.amount||0));
    }
    return;
  }

  // Compatibilidade com depósitos antigos que não guardavam o mapa de distribuição.
  if(entry.bill&&entry.bill!=="Distribuição automática"){
    const bill=(state.bills||[]).find(b=>b.name===entry.bill);
    if(bill){
      bill.reserved=Math.max(0,Number(bill.reserved||0)-total);
    }
    return;
  }

  let left=total;
  const bills=(state.bills||[])
    .filter(b=>Number(b.reserved||0)>0)
    .slice()
    .sort((a,b)=>new Date(b.due)-new Date(a.due));

  for(const bill of bills){
    if(left<=0)break;
    const remove=Math.min(left,Number(bill.reserved||0));
    bill.reserved=Math.max(0,Number(bill.reserved||0)-remove);
    left-=remove;
  }
}

function resetDepositDialogV404(){
  $("depositEditIdV4").value="";
  $("depositDialogTitleV4").textContent="Novo depósito";
  $("depositDialogSubtitleV4").textContent="Informe onde o dinheiro foi guardado.";
  $("saveDeposit").textContent="Salvar depósito";
  $("cashInput").value="";
  $("cardInput").value="";
  $("billSelect").value="auto";
  feedback("depositFeedbackV4","");
}

function openDepositV404(){
  resetDepositDialogV404();
  $("depositDialog").showModal();
}

function editDepositV404(id){
  const entry=(state.history||[]).find(item=>String(item.id)===String(id));
  if(!entry)return;

  $("depositEditIdV4").value=String(id);
  $("depositDialogTitleV4").textContent="Editar depósito";
  $("depositDialogSubtitleV4").textContent="Altere o valor ou a Bill de destino.";
  $("saveDeposit").textContent="Salvar alterações";
  $("cashInput").value=Number(entry.cash||0)?Number(entry.cash).toFixed(2):"";
  $("cardInput").value=Number(entry.card||0)?Number(entry.card).toFixed(2):"";

  const requested=entry.billId ||
    ((state.bills||[]).find(b=>b.name===entry.bill)?.id) ||
    "auto";
  $("billSelect").value=String(requested);
  feedback("depositFeedbackV4","");

  $("depositDialog").showModal();
}

async function deleteDepositV404(id){
  const entry=(state.history||[]).find(item=>String(item.id)===String(id));
  if(!entry)return;

  const cash=Number(entry.cash||0);
  const card=Number(entry.card||0);

  if(Number(state.cash||0)<cash||Number(state.card||0)<card){
    alert("Este depósito já foi usado em pagamentos. Não é possível excluí-lo porque o saldo ficaria negativo.");
    return;
  }

  if(!confirm(`Excluir este depósito de ${money(cash+card)}?\n\nO valor será removido do Envelope/Cartão e das reservas das Bills.`)){
    return;
  }

  const backup=structuredClone(state);

  try{
    state.cash=Math.max(0,Number(state.cash||0)-cash);
    state.card=Math.max(0,Number(state.card||0)-card);
    reverseDepositAllocationsV404(entry);
    state.history=(state.history||[]).filter(item=>String(item.id)!==String(id));
    state.dailyGoal=calculateFixedWorkdayGoal321(state.bills||[]);
    await persist("Depósito excluído");
  }catch(error){
    state=backup;
    render();
    fatalDiagnostic313("Excluir depósito de Bills 4.0.4",error,{deposit_id:id});
    alert(`Erro ao excluir depósito:\n\n${error?.message||String(error)}`);
  }
}

$("openDeposit").onclick=openDepositV404;

$("saveDeposit").onclick=async event=>{
  event.preventDefault();
  feedback("depositFeedbackV4","");

  const cash=Math.max(0,Number($("cashInput").value)||0);
  const card=Math.max(0,Number($("cardInput").value)||0);
  const total=cash+card;
  const billId=$("billSelect").value;
  const editId=$("depositEditIdV4").value;

  if(total<=0){
    feedback("depositFeedbackV4","Digite um valor.");
    return;
  }

  const backup=structuredClone(state);
  const button=$("saveDeposit");
  button.disabled=true;
  button.textContent=editId?"Salvando…":"Adicionando…";

  try{
    let existing=null;

    if(editId){
      existing=(state.history||[]).find(item=>String(item.id)===String(editId));
      if(!existing)throw new Error("Depósito original não encontrado.");

      const oldCash=Number(existing.cash||0);
      const oldCard=Number(existing.card||0);

      const resultingCash=Number(state.cash||0)-oldCash+cash;
      const resultingCard=Number(state.card||0)-oldCard+card;

      if(resultingCash<0||resultingCard<0){
        throw new Error("Esse dinheiro já foi utilizado. A alteração deixaria o Envelope ou Cartão negativo.");
      }

      state.cash=resultingCash;
      state.card=resultingCard;
      reverseDepositAllocationsV404(existing);
    }else{
      state.cash=Number(state.cash||0)+cash;
      state.card=Number(state.card||0)+card;
    }

    const allocations=allocateDepositV404(total,billId);
    const billName=billId==="auto"
      ? "Distribuição automática"
      : (state.bills||[]).find(b=>String(b.id)===String(billId))?.name||"Bill";

    const record={
      id:editId || crypto.randomUUID?.() || String(Date.now()),
      type:"bill_deposit",
      date:existing?.date||new Date().toISOString(),
      updatedAt:new Date().toISOString(),
      text:editId?"Depósito editado":"Depósito adicionado",
      cash,
      card,
      amount:total,
      bill:billName,
      billId,
      allocations
    };

    if(editId){
      const index=(state.history||[]).findIndex(item=>String(item.id)===String(editId));
      state.history[index]=record;
    }else{
      state.history=Array.isArray(state.history)?state.history:[];
      state.history.push(record);
    }

    state.dailyGoal=calculateFixedWorkdayGoal321(state.bills||[]);
    $("depositDialog").close();
    resetDepositDialogV404();
    await persist(editId?"Depósito atualizado":"Depósito salvo e sincronizado");
  }catch(error){
    state=backup;
    render();
    feedback("depositFeedbackV4",error?.message||"Não foi possível salvar o depósito.");
    fatalDiagnostic313("Salvar depósito de Bills 4.0.4",error,{deposit_id:editId||"novo"});
  }finally{
    button.disabled=false;
    button.textContent=editId?"Salvar alterações":"Salvar depósito";
  }
};

function resetBillForm(){
  $("billCreateEditId").value="";
  $("billCreateTitle").textContent="Nova Bill";
  $("newBillName").value="";
  $("newBillAmount").value="";
  $("newBillDue").value=currentLocalDate();
  $("newBillFrequency").value="monthly";
  $("newBillType").value="fixed";
  $("newBillCurrentInstallment").value=1;
  $("newBillTotalInstallments").value=12;
  $("installmentFields").classList.add("hidden");
}
function openBillCreateDialog(id=null){
  resetBillForm();
  if(id){
    const bill=state.bills.find(x=>x.id===id);
    if(!bill)return;
    $("billCreateEditId").value=id;
    $("billCreateTitle").textContent="Editar Bill";
    $("newBillName").value=bill.name;
    $("newBillAmount").value=bill.amount;
    $("newBillDue").value=bill.due;
    $("newBillFrequency").value=bill.frequency||"monthly";
    $("newBillType").value=bill.type||"fixed";
    $("newBillCurrentInstallment").value=bill.currentInstallment||1;
    $("newBillTotalInstallments").value=bill.totalInstallments||12;
    $("installmentFields").classList.toggle("hidden",bill.type!=="installment");
  }
  $("billCreateDialog").showModal();setTimeout(updateGoalPreview313,0);
}
function renderCompletedBills(){
  const list=state.completedBills||[];
  $("completedBillsList").innerHTML=list.length?[...list].reverse().map(b=>`
    <article class="completed-bill-item">
      <div class="completed-bill-item-top">
        <div><strong>${b.name}</strong><small>${money(b.amount)} · concluída em ${new Date(b.completedAt).toLocaleDateString("pt-BR")}</small></div>
        <span class="completed-bill-badge">${b.type==="installment"?`${b.totalInstallments}/${b.totalInstallments}`:"Concluída"}</span>
      </div>
      <div class="completed-bill-actions"><button data-restore-bill="${b.id}">Restaurar</button></div>
    </article>`).join(""):'<div class="empty-state">Nenhuma Bill concluída ainda.</div>';
  document.querySelectorAll("[data-restore-bill]").forEach(btn=>btn.onclick=()=>restoreCompletedBill(btn.dataset.restoreBill));
}
async function restoreCompletedBill(id){
  const item=(state.completedBills||[]).find(x=>x.id===id);
  if(!item)return;
  const restored={...structuredClone(item),completed:false,reserved:0};
  delete restored.completedAt;
  if(restored.type==="installment")restored.currentInstallment=1;
  state.bills.push(restored);
  state.completedBills=state.completedBills.filter(x=>x.id!==id);
  $("completedBillsDialog").close();
  await persist("Bill restaurada");
}

function openEdit(id){const b=state.bills.find(x=>x.id===id);$("editId").value=id;$("editTitle").textContent=b.name;$("editAmount").value=b.amount;$("editDue").value=b.due;$("editReserved").value=b.reserved;$("editDialog").showModal()}
$("saveEdit").onclick=async e=>{e.preventDefault();const b=state.bills.find(x=>x.id===$("editId").value);b.amount=Number($("editAmount").value)||0;b.due=$("editDue").value;b.reserved=Number($("editReserved").value)||0;$("editDialog").close();await persist("Alterações salvas")};

function addOneMonth(dateString){
  const [year,month,day]=dateString.split("-").map(Number);
  const nextMonthIndex=month;
  const lastDay=new Date(year,nextMonthIndex+1,0).getDate();
  const safeDay=Math.min(day,lastDay);
  const next=new Date(year,nextMonthIndex,safeDay,12,0,0);
  return `${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}-${String(next.getDate()).padStart(2,"0")}`;
}
function paymentRecordForBill(bill){
  return {
    id:crypto.randomUUID(),
    date:new Date().toISOString(),
    text:`${bill.name} paga`,
    type:"bill_payment",
    bill:bill.name,
    amount:Number(bill.amount||0),
    reservedUsed:Number(bill.reserved||0),
    duePaid:bill.due,
    cash:0,
    card:0
  };
}

async function togglePaid(id){
  const bill=state.bills.find(x=>x.id===id);
  if(!bill)return;

  const oldReserved=Number(bill.reserved||0);
  state.history=state.history||[];
  state.history.push(paymentRecordForBill(bill));

  let amountToRemove=oldReserved;
  const fromCash=Math.min(Number(state.cash||0),amountToRemove);
  state.cash=Math.max(0,Number(state.cash||0)-fromCash);
  amountToRemove-=fromCash;
  if(amountToRemove>0)state.card=Math.max(0,Number(state.card||0)-amountToRemove);

  if(bill.type==="installment"){
    if(Number(bill.currentInstallment)>=Number(bill.totalInstallments)){
      bill.completed=true;
      state.completedBills.push({
        ...structuredClone(bill),
        completedAt:new Date().toISOString()
      });
      state.bills=state.bills.filter(x=>x.id!==bill.id);
      await persist(`${bill.name} concluída (${bill.totalInstallments}/${bill.totalInstallments})`);
      confetti();
      return;
    }
    bill.currentInstallment=Number(bill.currentInstallment)+1;
  }

  if(bill.frequency==="once"){
    bill.completed=true;
    state.completedBills.push({...structuredClone(bill),completedAt:new Date().toISOString()});
    state.bills=state.bills.filter(x=>x.id!==bill.id);
    await persist(`${bill.name} concluída`);
    confetti();
    return;
  }

  bill.due=advanceDueDate(bill.due,bill.frequency);
  bill.reserved=0;
  bill.paid=false;

  await persist(`${bill.name} paga · próximo vencimento ${formatDate(bill.due)}`);
  confetti();
};
function confetti(){const c=$("confetti"),x=c.getContext("2d");c.width=innerWidth;c.height=innerHeight;let ps=Array.from({length:45},()=>({x:innerWidth/2,y:innerHeight*.35,vx:(Math.random()-.5)*8,vy:-Math.random()*7-2,g:.22,s:Math.random()*4+2,h:Math.random()*360})),n=0;function f(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;x.fillStyle=`hsl(${p.h} 80% 60%)`;x.fillRect(p.x,p.y,p.s,p.s)});if(n++<80)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)}f()}


function openIncomeDialog(){
  $("incomeEditId").value="";
  $("incomeDialogTitle").textContent="Adicionar receita";
  $("incomeAmount").value="";
  $("incomeDescription").value="";
  $("incomePerson").value="casal";
  $("incomeDate").value=currentLocalDate();
  $("incomeDialog").showModal();
}
$("openIncome").onclick=openIncomeDialog;
$("openIncomeToday").onclick=openIncomeDialog;
$("saveIncome").onclick=async e=>{
  e.preventDefault();
  const amount=Number($("incomeAmount").value)||0;
  if(amount<=0)return toast("Digite um valor válido");
  state.incomes=Array.isArray(state.incomes)?state.incomes:[];
  state.incomes.push({
    id:crypto.randomUUID(),
    amount,
    description:$("incomeDescription").value.trim(),
    person:$("incomePerson").value,
    date:$("incomeDate").value||currentLocalDate()
  });
  $("incomeAmount").value="";
  $("incomeDescription").value="";
  $("incomeDialog").close();
  await persist("Receita registrada");
};

document.querySelectorAll(".nav-item").forEach(button=>button.onclick=()=>switchView(button.dataset.view));
$("openExpense").onclick=()=>{
  $("expenseEditId").value="";
  $("expenseDialogTitle").textContent="Novo gasto";
  $("expenseAmount").value="";
  $("expenseCategory").value="gasolina";
  $("expenseDescription").value="";
  $("expenseDate").value=currentLocalDate();
  $("expenseDialog").showModal();
};
$("saveExpense").onclick=async e=>{
  e.preventDefault();
  const amount=Number($("expenseAmount").value)||0;
  if(amount<=0)return toast("Digite um valor válido");
  state.expenses=Array.isArray(state.expenses)?state.expenses:[];
  const editId=$("expenseEditId").value;
  const payload={
    amount,
    category:$("expenseCategory").value,
    description:$("expenseDescription").value.trim(),
    date:$("expenseDate").value||currentLocalDate()
  };
  if(editId){
    const item=state.expenses.find(x=>x.id===editId);
    if(item)Object.assign(item,payload);
  }else{
    state.expenses.push({id:crypto.randomUUID(),...payload});
  }
  $("expenseDialog").close();
  await persist(editId?"Gasto atualizado":"Gasto registrado");
};
$("openVaultDeposit").onclick=()=>{
  $("vaultEditId").value="";
  $("vaultDialogTitle").textContent="Adicionar ao Cofre";
  $("vaultAmount").value="";
  $("vaultDescription").value="";
  $("vaultLocation").value="envelope";
  $("vaultDate").value=currentLocalDate();
  $("vaultDialog").showModal();
};

$("saveVaultDeposit").onclick=async event=>{
  event.preventDefault();
  const amount=Number($("vaultAmount").value)||0;
  if(amount<=0)return toast("Digite um valor válido");

  const description=$("vaultDescription").value.trim();
  const location=$("vaultLocation").value;
  const date=$("vaultDate").value||currentLocalDate();

  normalizeVaultV4();
  state.vaultEntries.push({
    id:crypto.randomUUID?.()||String(Date.now()),
    type:"deposit",
    amount,
    description,
    location,
    date,
    createdAt:new Date().toISOString()
  });

  state.history=Array.isArray(state.history)?state.history:[];
  state.history.push({
    id:crypto.randomUUID?.()||String(Date.now()+1),
    type:"vault_deposit",
    text:`Adicionado ao Cofre · ${location==="card"?"Cartão":"Envelope"}`,
    amount,
    date:new Date(`${date}T12:00:00`).toISOString()
  });

  $("vaultDialog").close();
  await persist("Valor adicionado ao Cofre");
};

$("openVaultWithdrawV4").onclick=()=>{
  $("vaultWithdrawLocationV4").value="envelope";
  $("vaultWithdrawAmountV4").value="";
  $("vaultWithdrawDescriptionV4").value="";
  $("vaultWithdrawDateV4").value=currentLocalDate();
  feedback("vaultWithdrawFeedbackV4","");
  $("vaultWithdrawDialogV4").showModal();
};

$("confirmVaultWithdrawV4").onclick=async()=>{
  feedback("vaultWithdrawFeedbackV4","");
  const location=$("vaultWithdrawLocationV4").value;
  const amount=Number($("vaultWithdrawAmountV4").value)||0;
  const description=$("vaultWithdrawDescriptionV4").value.trim();
  const date=$("vaultWithdrawDateV4").value||currentLocalDate();
  const available=vaultLocationBalanceV4(location);

  if(amount<=0)return feedback("vaultWithdrawFeedbackV4","Digite um valor válido.");
  if(amount>available){
    return feedback("vaultWithdrawFeedbackV4",`Saldo insuficiente no ${location==="card"?"Cartão":"Envelope"}. Disponível: ${money(available)}`);
  }

  normalizeVaultV4();
  state.vaultEntries.push({
    id:crypto.randomUUID?.()||String(Date.now()),
    type:"withdrawal",
    amount,
    description,
    location,
    date,
    createdAt:new Date().toISOString()
  });

  state.history=Array.isArray(state.history)?state.history:[];
  state.history.push({
    id:crypto.randomUUID?.()||String(Date.now()+1),
    type:"vault_withdrawal",
    text:`Retirado do Cofre · ${location==="card"?"Cartão":"Envelope"}`,
    amount,
    date:new Date(`${date}T12:00:00`).toISOString()
  });

  $("vaultWithdrawDialogV4").close();
  await persist("Retirada do Cofre registrada");
};


const APP_VERSION="6.0.0-beta.6";
const RELEASE_NOTES=[
  {version:"6.0.0-beta.6",date:"10/08/2026",title:"Client List Readability",changes:["Rota voltou para o centro da navegação inferior, entre Bills e Gastos.","Nomes, informações e botões da Lista de clientes ficaram maiores e mais legíveis.","Nenhuma lógica dos clientes foi alterada."]},
  {version:"6.0.0-beta.5",date:"10/08/2026",title:"Route Navigation Position",changes:["Rota movida para ficar imediatamente entre Geral e Bills.","Todas as outras abas mantiveram sua ordem relativa.","Nenhuma função ou cálculo foi alterado."]},
  {version:"6.0.0-beta.4",date:"10/08/2026",title:"Route Navigation & Client Notes",changes:["A aba Rota ganhou destaque permanente na navegação.","Campo Notas adicionado ao cadastro e edição de clientes.","Custos, estacionamento e endereço removidos do formulário.","Preview de cliente simplificado para Receita prevista."]},
  {version:"6.0.0-beta.1",date:"07/08/2026",title:"Finance & Business Dashboard",changes:["Novo Mapa do Dinheiro na aba Geral.","Análise automática das categorias de gastos.","Receitas da Rota ficam protegidas e sincronizadas com a Geral.","Previsão financeira da Rota para 30 dias.","Média semanal, média por hora, cancelamentos perdidos e dia mais cheio.","Clientes agora podem guardar horário, postcode e endereço.","Painel Mostrar mais da Rota foi reconstruído e simplificado."]},
  {version:"5.0.0-beta.14",date:"07/08/2026",title:"Fontes maiores e integração com Receitas",changes:["Fontes dos cards principais aumentadas novamente.","Todo pagamento confirmado na Rota cria ou atualiza automaticamente uma Receita na aba Geral.","Alterações de valor, data ou forma de pagamento permanecem sincronizadas.","Ao desmarcar pagamento, a Receita vinculada é removida.","Receitas antigas da Rota são reconciliadas automaticamente sem duplicação."]},
  {version:"5.0.0-beta.13",date:"07/08/2026",title:"Route UI Polish",changes:["Fontes da aba Rota aumentadas para melhorar leitura.","Pesquisa removida de Mostrar mais por ser redundante com Lista de clientes.","Resumo mensal mantido como foco principal do painel expandido.","Botões e cards receberam ajustes de legibilidade sem alterar cálculos."]},
  {version:"5.0.0-beta.12",date:"06/08/2026",title:"Painel da Rota simétrico",changes:["Seis indicadores em grade 3 por 2.","Cards com a mesma largura e altura.","Esperado e Recebido exibem quantidades.","Mais ocupa 30% e Lista de clientes 70%."]},
  {version:"5.0.0-beta.11",date:"06/08/2026",title:"Extras nos resumos e primeira data obrigatória",changes:["Extras aparecem no resumo semanal.","Extras aparecem no resumo mensal.","Todo cliente precisa de uma primeira data.","Cliente Extra já é agendado na data escolhida e continua disponível para futuros serviços."]},
  {version:"5.0.0-beta.10",date:"06/08/2026",title:"Clientes extras e lista geral",changes:["Novo tipo Extra · sem data fixa.","Clientes extras são adicionados pelo calendário somente nos dias escolhidos.","Selo Extra identifica esses serviços.","Lista alfabética de clientes adicionada ao lado de Mostrar mais.","Lista permite abrir perfil, editar e excluir clientes."]},
  {version:"5.0.0-beta.9.1",date:"06/08/2026",title:"Correção do resumo mensal",changes:["Corrigido erro overdueAmount ao abrir dados após login.","Valor e quantidade de clientes em atraso voltaram a carregar no resumo mensal.","Calendário e demais funções da Rota foram preservados."]},
  {version:"5.0.0-beta.9.1",date:"06/08/2026",title:"Calendário da Rota e atrasos mensais",changes:["Calendário ao lado de Rota.","Datas mostram clientes.","Cancelamento de um ou vários dias.","Resumo mensal mostra atrasos.","Dinheiro e Cartão agrupados."]},
  {version:"5.0.0-beta.8",date:"06/08/2026",title:"Resumo semanal limpo e abertura no dia atual",changes:["Card duplicado Cancelados removido do resumo semanal.","Cancelados do mês mostram valor total e quantidade de clientes.","Botão Mostrar mais ficou mais fino e discreto.","A Rota sempre abre na semana atual e no dia de hoje."]},
  {version:"5.0.0-beta.7",date:"06/08/2026",title:"Rota mais limpa e recebimentos separados",changes:["Botão Mostrar mais reduzido.","Resumo mensal mostra dinheiro e cartão.","Atrasados e cancelados abaixo do resumo semanal.","Barra de filtros removida."]},
  {version:"5.0.0-beta.6",date:"06/08/2026",title:"Rota compacta e resumo mensal",changes:["Atrasados e cancelados lado a lado.","Busca e filtros dentro de Mostrar mais.","Resumo mensal adicionado.","Nova frequência Somente uma vez.","Scroll mais suave."]},
  {version:"5.0.0-beta.5",date:"06/08/2026",title:"Sequência automática e filtros aprimorados",changes:["Sequência automática quando o campo fica vazio.","Data alterada permite escolher a sequência no novo dia.","Atraso começa somente no dia seguinte à limpeza.","Busca redesenhada e continua consultando todos os clientes.","Filtros de pagos, pendentes, atrasados e cancelados ganharam contadores, totais e visual próprio."]},
  {version:"5.0.0-beta.4",date:"06/08/2026",title:"Cadastro e busca de clientes corrigidos",changes:["Salvar cliente corrigido com validação da sequência.","Busca passa a consultar todos os clientes cadastrados.","Favoritos e observações removidos.","Exclusão permanente remove cliente, visitas e receitas vinculadas.","Resultados de busca permitem abrir perfil ou editar cliente."]},
  {version:"5.0.0-beta.3",date:"06/08/2026",title:"Menu compacto e sequência do cliente",changes:["Sequência obrigatória e visível ao cadastrar ou editar clientes.","Menu do número reduzido para quatro opções principais.","Botão Mostrar mais revela cancelamento, restauração, perfil e edição do cadastro.","Menu ocupa menos espaço na tela."]},
  {version:"5.0.0-beta.2",date:"06/08/2026",title:"Route CRM Beta 2",changes:["Atrasados movidos para o topo com total em libras e confirmação de pagamento.","Menu extra aberto pelo botão de ordem do cliente.","Busca, filtros, favoritos e duplicação de clientes.","Perfil individual com histórico, totais mensais e anuais, horas, lucro e cancelamentos.","Código da Rota dividido em módulos menores."]},
  {version:"5.0.0-beta.1",date:"06/08/2026",title:"Rota de Limpezas Beta",changes:["Nova aba Rota com agenda de segunda a domingo.","Clientes semanais e quinzenais com ordem diária.","Controle de horas, valores esperados e recebidos.","Confirmação de pagamento em dinheiro ou cartão.","Lista de pagamentos atrasados.","Pressionar por 2 segundos permite remarcar, alterar horas, valor ou cancelar."]},
  {version:"4.1.1",date:"05/08/2026",title:"Compatibilidade do calendário corrigida",changes:["Restaurada a função localDateKey usada pela Visão Geral.","Calendário e Estatísticas mantêm a nova lógica sem quebrar telas antigas.","Login e carregamento dos dados voltam a funcionar normalmente."]},
  {version:"4.1.0",date:"05/08/2026",title:"Calendário, estatísticas e backup externo",changes:["Calendário de depósitos reconstruído para mostrar apenas reservas das Bills.","Estatísticas mensais com histórico, CSV e relatório para salvar como PDF.","Backup automático salvo externamente no Supabase Storage.","Importação de backup JSON para restaurar todo o controle.","Backup atualizado após cada sincronização."]},
  {version:"4.0.4",date:"05/08/2026",title:"Editar e excluir depósitos das Bills",changes:["Depósitos agora têm botões de editar e excluir no histórico.","Editar desfaz o depósito antigo antes de aplicar o novo.","Excluir remove os valores do Envelope, Cartão e reservas das Bills.","Novos depósitos salvam o mapa exato de distribuição entre as Bills.","Alterações são bloqueadas quando o dinheiro já foi usado."]},
  {version:"4.0.3",date:"05/08/2026",title:"Atualização forçada no Safari",changes:["Service workers antigos são removidos.","Caches do site são apagados ao abrir.","Pagamento dividido e limpeza do histórico passam a carregar sem versão antiga.","A versão carregada aparece nas Configurações."]},
  {version:"4.0.2",date:"05/08/2026",title:"Pagamento dividido e histórico corrigido",changes:["Ao pagar uma Bill, o app pergunta quanto sai do Envelope e do Cartão.","O pagamento valida os saldos e exige a soma exata da Bill.","Pagamentos aparecem em vermelho no histórico.","Limpar histórico de Bills agora grava diretamente no Supabase."]},
  {version:"4.0.1",date:"05/08/2026",title:"Histórico do Cofre em ordem correta",changes:["Movimentações mais recentes aparecem no topo.","Movimentações do mesmo dia respeitam a ordem em que foram adicionadas.","Novas entradas e retiradas salvam o horário exato."]},
  {version:"4.0.0",date:"05/08/2026",title:"Reconstrução limpa das Bills e do Cofre",changes:["Cofre redesenhado com Envelope e Cartão separados.","Movimentações verdes para entradas e vermelhas para retiradas.","Cards de Bills reconstruídos com editar, excluir e pagar integrados.","Histórico de Bills usa verde para adições e vermelho para pagamentos.","Funções antigas duplicadas dessas telas foram substituídas."]},
  {version:"3.2.1",date:"05/08/2026",title:"Meta fixa por dia trabalhado",changes:["Meta principal agora é o total das Bills dividido por 20 dias trabalhados.","Depósitos não diminuem mais a meta diária.","O retângulo mostra Meta por dia e Já guardado.","Adicionar, remover ou editar Bills recalcula a meta.","Adicionada opção para limpar somente o histórico de atividades das Bills."]},
  {version:"3.2.0",date:"05/08/2026",title:"Motor único da meta e reset",changes:["Todas as rotas usam um cálculo autônomo.","Removida dependência de funções inacessíveis no Safari.","Reset grava diretamente no Supabase.","Prévia, topo e persistência usam o mesmo resultado."]},
  {version:"3.1.9",date:"05/08/2026",title:"Meta e reset substituídos diretamente",changes:["A meta é calculada com as mesmas Bills exibidas na tela.","O valor é atualizado durante a renderização, sem função atrasada.","O reset grava diretamente no Supabase sem usar o fluxo antigo.","Erros do banco passam a ser exibidos integralmente."]},
  {version:"3.1.8",date:"05/08/2026",title:"Correção definitiva da meta e reset",changes:["Substituído integralmente o cálculo defeituoso da meta diária.","Corrigido uso da variável Bill fora do loop.","Reset agora recalcula e atualiza a interface antes de sincronizar.","Histórico antigo é normalizado antes do reset."]},
  {version:"3.1.7",date:"05/08/2026",title:"Meta diária e reset corrigidos",changes:["Leitura de valores aceita formatos com libra e vírgula.","Datas ISO e brasileiras são reconhecidas.","Meta diária deixa de zerar quando existem Bills pendentes.","Zerar reservas e depósitos voltou a funcionar com dupla confirmação."]},
  {version:"3.1.6",date:"05/08/2026",title:"Meta diária realmente dinâmica",changes:["A meta agora considera todas as Bills ativas e seus vencimentos.","Adicionar, editar, remover, concluir ou reservar uma Bill recalcula a meta.","O cartão informa quanto ainda falta cobrir.","A prévia do formulário mostra a meta antes de salvar."]},
  {version:"3.1.5",date:"05/08/2026",title:"Bills mais limpa e organizada",changes:["Envelope e Cartão voltaram em cartões próprios.","Meta diária ganhou um retângulo compacto no topo.","Compartilhar foi movido para o final da tela Bills.","Resumo principal ficou menos poluído."]},
  {version:"3.1.0",date:"05/08/2026",title:"Refatoração de estabilidade",changes:[
    "Removidos scripts e manipuladores duplicados.",
    "Login unificado em um único fluxo.",
    "Dashboard, Bills e filtros renderizados uma única vez.",
    "Controle diário das limpezas preservado.",
    "Envelope e Cartão atualizados diretamente pelo estado.",
    "Atualizações geradas por uma única lista de versões.",
    "Service Worker simplificado e sem cache de arquivos antigos."
  ]},
  {version:"2.1.10",date:"04/08/2026",title:"Envelope e Cartão",changes:["Resumo do dinheiro guardado na tela de Bills."]},
  {version:"2.1.9",date:"04/08/2026",title:"Central de controle",changes:["Configurações organizadas e ferramentas de dados."]},
  {version:"2.1.8",date:"04/08/2026",title:"Controle de limpezas",changes:["Pagamentos diários, totais e edição."]},
  {version:"2.0.1",date:"03/08/2026",title:"Clean Premium",changes:["Dashboard e Bills compactas."]}
];
const q=(selector,root=document)=>root.querySelector(selector);
const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];
const safeOpen=dialog=>{if(!dialog)return;try{dialog.showModal()}catch{dialog.setAttribute("open","")}};
const safeClose=dialog=>{if(!dialog)return;try{dialog.close()}catch{dialog.removeAttribute("open")}};

function monthSummary(){
  const month=currentLocalDate().slice(0,7);
  const total=list=>(list||[]).filter(x=>String(x.date||"").slice(0,7)===month).reduce((s,x)=>s+Number(x.amount||0),0);
  const bills=(state?.bills||[]).filter(x=>!x.completed);
  const income=total(state?.incomes),expense=total(state?.expenses),vault=total(state?.vaultEntries);
  const reserved=bills.reduce((s,x)=>s+Number(x.reserved||0),0);
  return {income,expense,vault,reserved,bills,free:income-expense-vault-reserved};
}
function daysSafe(date){const a=new Date(`${currentLocalDate()}T12:00:00`),b=new Date(`${date}T12:00:00`);return Math.ceil((b-a)/86400000)}
function billEmoji(name){const n=String(name||"").toLowerCase();if(n.includes("energia"))return "⚡";if(n.includes("alug"))return "⌂";if(n.includes("água")||n.includes("agua"))return "💧";if(n.includes("carro")||n.includes("seguro"))return "🚗";if(n.includes("council"))return "▦";return "£"}

function renderCleanDashboard(){
  const view=$("overviewView");if(!view||!state)return;
  let root=$("v22Dashboard");if(!root){root=document.createElement("div");root.id="v22Dashboard";root.className="v21-dashboard";view.prepend(root)}
  const d=monthSummary();const overdue=d.bills.slice().sort((a,b)=>new Date(a.due)-new Date(b.due)).find(x=>daysSafe(x.due)<0);
  const notice=overdue?{tone:"danger",label:"AÇÃO NECESSÁRIA",title:`${overdue.name} está vencida`,text:`Faltam ${money(Math.max(0,overdue.amount-overdue.reserved))} para completar.`}:{tone:"success",label:"MÊS ATUAL",title:d.income?`${money(Math.max(0,d.free))} livres`:'Registre sua primeira receita',text:'Depois de Bills, gastos e Cofre.'};
  const pct=d.income?Math.max(0,Math.min(100,d.free/d.income*100)):0;
  const recent=(state.incomes||[]).filter(x=>String(x.date||"").slice(0,7)===currentLocalDate().slice(0,7)).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
  root.innerHTML=`<section class="v21-insight ${notice.tone}"><i></i><div><small>${notice.label}</small><strong>${notice.title}</strong><p>${notice.text}</p></div></section>
  <section class="v21-hero"><div><span>SALDO LIVRE DO MÊS</span><strong>${money(d.free)}</strong><p>Já descontando tudo que foi separado.</p></div><div class="v21-score" style="--score:${pct}"><b>${pct.toFixed(0)}%</b><small>livre</small></div><div class="v21-hero-row"><span>Recebido <b>${money(d.income)}</b></span><span>Comprometido <b>${money(d.reserved+d.expense)}</b></span><span>Protegido <b>${money(d.vault)}</b></span></div></section>
  <section class="v21-grid"><article class="income"><span>Receitas</span><strong>${money(d.income)}</strong></article><article class="bills"><span>Bills</span><strong>${money(d.reserved)}</strong></article><article class="expense"><span>Gastos</span><strong>${money(d.expense)}</strong></article><article class="vault"><span>Cofre</span><strong>${money(d.vault)}</strong></article></section>
  <section class="v21-actions"><button id="v22Cleaning"><span>＋</span><div><b>Registrar limpeza</b><small>Pagamento diário</small></div></button><button id="v22Income"><span>＋</span><div><b>Adicionar receita</b><small>Outra entrada</small></div></button><button id="v22Stats"><span>⌁</span><div><b>Estatísticas</b><small>Histórico e PDF</small></div></button></section>
  <section class="v21-recent"><header><div><small>ATIVIDADE</small><h3>Receitas recentes</h3></div></header><div>${recent.length?recent.map(x=>`<article><i>↗</i><div><b>${escapeText(x.description||x.client||'Receita')}</b><small>${formatDate(x.date)}</small></div><strong>+${money(x.amount)}</strong></article>`).join(''):'<p class="v21-empty">Nenhuma receita neste mês.</p>'}</div></section>`;
  $("v22Income").onclick=()=>$("openIncome")?.click();$("v22Stats").onclick=openStatisticsV410;$("v22Cleaning").onclick=()=>openCleaningDialog();
}
function escapeText(value){const div=document.createElement('div');div.textContent=String(value??'');return div.innerHTML}

let activeBillFilter="all";
function calculateGoalFromRenderedBills319(bills){
  return calculateFixedWorkdayGoal321(bills);
}

function updateBillTopCards319(bills){
  updateFixedGoalCards321(bills);

  const envelope=$("billEnvelopeBalance");
  const card=$("billCardBalance");

  if(envelope)envelope.textContent=money(Number(state?.cash||0));
  if(card)card.textContent=money(Number(state?.card||0));
}
function renderCleanBills(){
  if(!state)return;
  const list=$("billList");
  if(!list)return;

  const bills=(state.bills||[])
    .filter(b=>!b.completed)
    .slice()
    .sort((a,b)=>new Date(a.due)-new Date(b.due));

  renderBillHeader(bills);
  list.innerHTML="";

  for(const bill of bills){
    const amount=Number(bill.amount||0);
    const reserved=Number(bill.reserved||0);
    const remaining=Math.max(0,amount-reserved);
    const percent=amount?Math.min(100,reserved/amount*100):100;
    const days=daysSafe(bill.due);
    const statusClass=days<0?"late":days<=7?"soon":"normal";
    const statusText=days<0?`${Math.abs(days)}d atrasada`:days===0?"Vence hoje":`${days}d`;

    const card=document.createElement("article");
    card.className="bill-card-v4";
    card.dataset.days=String(days);
    card.dataset.ready=String(remaining===0);

    card.innerHTML=`
      <div class="bill-v4-head">
        <div class="bill-v4-icon">${billEmoji(bill.name)}</div>
        <div class="bill-v4-name">
          <strong>${escapeText(bill.name)}</strong>
          <small>${formatDate(bill.due)} · ${frequencyLabel(bill.frequency)}</small>
        </div>
        <span class="bill-v4-status ${statusClass}">${statusText}</span>
      </div>
      <div class="bill-v4-progress"><i style="width:${percent}%"></i></div>
      <div class="bill-v4-values">
        <div>
          <span>Reservado</span>
          <strong>${money(reserved)} <small>/ ${money(amount)}</small></strong>
          <em>${remaining>0?`${money(remaining)} restantes`:"Totalmente reservada"}</em>
        </div>
        <div class="bill-v4-actions">
          <button class="bill-icon-action edit" type="button" aria-label="Editar Bill">✎</button>
          <button class="bill-icon-action delete" type="button" aria-label="Excluir Bill">🗑</button>
          <button class="bill-icon-action paid" type="button" aria-label="Pagar Bill" title="Pagar Bill">£✓</button>
        </div>
      </div>
      ${bill.type==="installment"?`
        <div class="bill-v4-installment">
          <span>Parcela ${bill.currentInstallment}/${bill.totalInstallments}</span>
          <i><b style="width:${Math.min(100,bill.currentInstallment/bill.totalInstallments*100)}%"></b></i>
        </div>`:""}
    `;

    card.querySelector(".edit").onclick=()=>openBillCreateDialog(bill.id);
    card.querySelector(".delete").onclick=()=>deleteBillV4(bill.id);
    card.querySelector(".paid").onclick=()=>openBillPaymentV4(bill.id);
    list.appendChild(card);
  }

  applyBillFilter();
  updateBillTopCards319(bills);
  renderBillActivityV4();
}

async function deleteBillV4(id){
  const bill=(state.bills||[]).find(item=>String(item.id)===String(id));
  if(!bill)return;
  if(!confirm(`Excluir a Bill “${bill.name}”?\n\nA conta será removida permanentemente.`))return;

  const oldBills=structuredClone(state.bills||[]);
  const oldHistory=structuredClone(state.history||[]);
  try{
    state.bills=(state.bills||[]).filter(item=>String(item.id)!==String(id));
    state.dailyGoal=calculateFixedWorkdayGoal321(state.bills);
    state.history=Array.isArray(state.history)?state.history:[];
    state.history.push({
      id:crypto.randomUUID?.()||String(Date.now()),
      type:"bill_deleted",
      text:`Bill excluída · ${bill.name}`,
      bill:bill.name,
      amount:Number(bill.amount||0),
      date:new Date().toISOString()
    });
    await persist("Bill excluída");
  }catch(error){
    state.bills=oldBills;
    state.history=oldHistory;
    render();
    fatalDiagnostic313("Excluir Bill 4.0",error,{bill_id:id});
    toast("Não foi possível excluir a Bill");
  }
}

function normalizeBillDepositsV404(){
  if(!Array.isArray(state?.history))return;
  state.history=state.history.map((item,index)=>{
    const text=String(item?.text||"").toLowerCase();
    const looksLikeDeposit=
      item?.type==="bill_deposit" ||
      (text.includes("depósito")&&((Number(item?.cash)||0)+(Number(item?.card)||0)>0));

    if(!looksLikeDeposit)return item;

    return {
      id:item.id||`legacy-deposit-${index}-${String(item.date||"").replace(/\D/g,"")}`,
      type:"bill_deposit",
      amount:Number(item.amount||0)||Number(item.cash||0)+Number(item.card||0),
      ...item
    };
  });
}

function renderBillActivityV4(){
  const container=$("historyList");
  if(!container)return;

  const items=(Array.isArray(state.history)?state.history:[])
    .map((item,index)=>({...item,__index:index}))
    .sort((a,b)=>{
      const aTime=new Date(a.updatedAt||a.date||0).getTime();
      const bTime=new Date(b.updatedAt||b.date||0).getTime();
      return bTime!==aTime?bTime-aTime:b.__index-a.__index;
    })
    .slice(0,30);

  if(!items.length){
    container.innerHTML='<div class="history-empty-v4">Nenhuma atividade registrada.</div>';
    return;
  }

  container.innerHTML=items.map(item=>{
    const text=String(item.text||item.label||"Atividade");
    const lower=text.toLowerCase();
    const type=String(item.type||"");
    const isDeposit=type==="bill_deposit" ||
      lower.includes("depósito adicionado") ||
      lower.includes("depósito editado");
    const added=isDeposit||type.includes("deposit")||lower.includes("adicionado");
    const removed=type==="bill_payment"||type==="bill_deleted"||lower.includes("paga")||lower.includes("excluída")||lower.includes("retirada");
    const tone=removed?"removed":added?"added":"neutral";
    const amount=Number(item.amount||0)||(Number(item.cash||0)+Number(item.card||0));

    return `<article class="history-item-v4 ${tone}">
      <span class="history-dot-v4"></span>
      <div class="history-content-v404">
        <strong>${escapeText(text)}</strong>
        <small>${new Date(item.date).toLocaleString("pt-BR")}${item.bill?` · ${escapeText(item.bill)}`:""}</small>
        ${isDeposit?`<span class="deposit-breakdown-v404">Envelope ${money(Number(item.cash||0))} · Cartão ${money(Number(item.card||0))}</span>`:""}
      </div>
      <div class="history-right-v404">
        <b>${amount?`${removed?"−":"+"}${money(amount)}`:""}</b>
        ${isDeposit?`
          <div class="deposit-actions-v404">
            <button type="button" data-edit-deposit-v404="${item.id}" aria-label="Editar depósito">✎</button>
            <button type="button" data-delete-deposit-v404="${item.id}" aria-label="Excluir depósito">🗑</button>
          </div>`:""}
      </div>
    </article>`;
  }).join("");

  container.querySelectorAll("[data-edit-deposit-v404]").forEach(button=>{
    button.onclick=()=>editDepositV404(button.dataset.editDepositV404);
  });

  container.querySelectorAll("[data-delete-deposit-v404]").forEach(button=>{
    button.onclick=()=>deleteDepositV404(button.dataset.deleteDepositV404);
  });
}

function openBillPaymentV4(id){
  const bill=(state.bills||[]).find(item=>String(item.id)===String(id));
  if(!bill)return;

  const amount=Math.max(0,Number(bill.amount||0));
  const envelope=Math.max(0,Number(state.cash||0));
  const card=Math.max(0,Number(state.card||0));

  $("billPaymentIdV4").value=String(id);
  $("billPaymentSubtitleV4").textContent=bill.name;
  $("billPaymentTotalV4").textContent=money(amount);
  $("billPaymentEnvelopeAvailableV4").textContent=`Disponível: ${money(envelope)}`;
  $("billPaymentCardAvailableV4").textContent=`Disponível: ${money(card)}`;

  const suggestedEnvelope=Math.min(envelope,amount);
  const suggestedCard=Math.max(0,amount-suggestedEnvelope);

  $("billPaymentEnvelopeV4").value=suggestedEnvelope?suggestedEnvelope.toFixed(2):"";
  $("billPaymentCardV4").value=suggestedCard?suggestedCard.toFixed(2):"";
  feedback("billPaymentFeedbackV4","");
  updateBillPaymentPreviewV4();

  try{$("billPaymentDialogV4").showModal()}
  catch{$("billPaymentDialogV4").setAttribute("open","")}
}

function updateBillPaymentPreviewV4(){
  const id=$("billPaymentIdV4").value;
  const bill=(state.bills||[]).find(item=>String(item.id)===String(id));
  if(!bill)return;

  const total=Math.max(0,Number(bill.amount||0));
  const envelope=Math.max(0,Number($("billPaymentEnvelopeV4").value||0));
  const card=Math.max(0,Number($("billPaymentCardV4").value||0));
  const entered=envelope+card;
  const remaining=Math.max(0,total-entered);
  const excess=Math.max(0,entered-total);

  $("billPaymentEnteredV4").textContent=money(entered);

  const status=$("billPaymentRemainingV4");
  if(excess>0){
    status.textContent=`Excede em ${money(excess)}`;
    status.className="excess";
  }else if(remaining>0){
    status.textContent=`Faltam ${money(remaining)}`;
    status.className="missing";
  }else{
    status.textContent="Valor completo";
    status.className="complete";
  }
}

async function confirmBillPaymentV4(){
  feedback("billPaymentFeedbackV4","");

  const id=$("billPaymentIdV4").value;
  const bill=(state.bills||[]).find(item=>String(item.id)===String(id));
  if(!bill)return;

  const total=Math.max(0,Number(bill.amount||0));
  const envelope=Math.max(0,Number($("billPaymentEnvelopeV4").value||0));
  const card=Math.max(0,Number($("billPaymentCardV4").value||0));
  const entered=Math.round((envelope+card)*100)/100;
  const expected=Math.round(total*100)/100;

  if(envelope>Number(state.cash||0)){
    feedback("billPaymentFeedbackV4",`Envelope insuficiente. Disponível: ${money(Number(state.cash||0))}`);
    return;
  }

  if(card>Number(state.card||0)){
    feedback("billPaymentFeedbackV4",`Cartão insuficiente. Disponível: ${money(Number(state.card||0))}`);
    return;
  }

  if(entered!==expected){
    feedback("billPaymentFeedbackV4",`A soma deve ser exatamente ${money(total)}.`);
    return;
  }

  const backup=structuredClone(state);
  const button=$("confirmBillPaymentV4");
  button.disabled=true;
  button.textContent="Pagando…";

  try{
    state.cash=Math.max(0,Number(state.cash||0)-envelope);
    state.card=Math.max(0,Number(state.card||0)-card);

    const target=(state.bills||[]).find(item=>String(item.id)===String(id));
    target.reserved=0;
    target.paid=true;
    target.completed=true;
    target.paidAt=new Date().toISOString();
    target.paidFrom={envelope,card};

    state.history=Array.isArray(state.history)?state.history:[];
    state.history.push({
      id:crypto.randomUUID?.()||String(Date.now()),
      type:"bill_payment",
      text:`Bill paga · ${target.name}`,
      bill:target.name,
      amount:total,
      cash:envelope,
      card,
      date:new Date().toISOString()
    });

    state.dailyGoal=calculateFixedWorkdayGoal321(state.bills);

    try{$("billPaymentDialogV4").close()}catch{}
    await persist("Bill paga com sucesso");
  }catch(error){
    state=backup;
    render();
    fatalDiagnostic313("Pagamento de Bill 4.0.2",error,{bill_id:id});
    feedback("billPaymentFeedbackV4","Não foi possível concluir o pagamento.");
  }finally{
    button.disabled=false;
    button.textContent="Confirmar pagamento";
  }
}

$("billPaymentEnvelopeV4")?.addEventListener("input",updateBillPaymentPreviewV4);
$("billPaymentCardV4")?.addEventListener("input",updateBillPaymentPreviewV4);
$("confirmBillPaymentV4")?.addEventListener("click",confirmBillPaymentV4);

function renderBillHeader(bills){const list=$("billList");let summary=$("v22BillSummary");if(!summary){summary=document.createElement('section');summary.id='v22BillSummary';summary.className='v21-bill-summary';list.before(summary)}const total=bills.reduce((s,b)=>s+Number(b.amount),0),reserved=bills.reduce((s,b)=>s+Number(b.reserved),0),pct=total?Math.min(100,reserved/total*100):0;summary.innerHTML=`<div><small>BILLS ATIVAS</small><strong>${bills.length} contas</strong><span>${money(total)} no total</span></div><div class="v21-summary-track"><i style="width:${pct}%"></i></div><b>${pct.toFixed(0)}% reservado</b>`;let filters=$("v22BillFilters");if(!filters){filters=document.createElement('div');filters.id='v22BillFilters';filters.className='v21-filters';filters.innerHTML='<button data-f="all">Todas</button><button data-f="late">Atrasadas</button><button data-f="week">7 dias</button><button data-f="ready">Reservadas</button>';summary.after(filters);filters.onclick=e=>{const btn=e.target.closest('button');if(!btn)return;activeBillFilter=btn.dataset.f;applyBillFilter()}}qa('button',filters).forEach(x=>x.classList.toggle('active',x.dataset.f===activeBillFilter))}
function applyBillFilter(){qa('.bill-card-v4').forEach(card=>{const days=Number(card.dataset.days),ready=card.dataset.ready==='true';let show=true;if(activeBillFilter==='late')show=days<0;if(activeBillFilter==='week')show=days>=0&&days<=7;if(activeBillFilter==='ready')show=ready;card.hidden=!show});const f=$("v22BillFilters");if(f)qa('button',f).forEach(x=>x.classList.toggle('active',x.dataset.f===activeBillFilter))}
function updateWalletSummary(){if($("quickCashTotal"))$("quickCashTotal").textContent=money(state.cash||0);if($("quickCardTotal"))$("quickCardTotal").textContent=money(state.card||0);if($("quickSavedTotal"))$("quickSavedTotal").textContent=money(Number(state.cash||0)+Number(state.card||0))}

function ensureCleaningDialog(){if($("v22CleaningDialog"))return;const d=document.createElement('dialog');d.id='v22CleaningDialog';d.innerHTML=`<form method="dialog" class="dialog-card"><input id="v22CleaningId" type="hidden"><div class="dialog-heading"><div><h2>Registrar limpeza</h2><p>Pagamento diário no dia correto.</p></div><button value="cancel" class="round-button">×</button></div><label>Cliente ou casa<input id="v22CleaningClient" type="text"></label><label>Valor recebido<input id="v22CleaningAmount" type="number" inputmode="decimal" step="0.01"></label><label>Data opcional<input id="v22CleaningDate" type="date"></label><label>Observação<input id="v22CleaningNotes" type="text"></label><button id="v22SaveCleaning" value="cancel" class="primary-button">Salvar pagamento</button></form>`;document.body.appendChild(d);$("v22SaveCleaning").onclick=saveCleaning}
function openCleaningDialog(id=''){ensureCleaningDialog();const item=id?(state.incomes||[]).find(x=>x.id===id):null;$("v22CleaningId").value=item?.id||'';$("v22CleaningClient").value=item?.client||item?.description||'';$("v22CleaningAmount").value=item?.amount||'';$("v22CleaningDate").value=item?.date||'';$("v22CleaningNotes").value=item?.notes||'';safeOpen($("v22CleaningDialog"))}
async function saveCleaning(e){e.preventDefault();const client=$("v22CleaningClient").value.trim(),amount=Number($("v22CleaningAmount").value)||0;if(!client)return toast('Informe o cliente');if(amount<=0)return toast('Digite um valor válido');const id=$("v22CleaningId").value,payload={amount,description:client,client,date:$("v22CleaningDate").value||currentLocalDate(),notes:$("v22CleaningNotes").value.trim(),source:'cleaning',category:'limpeza'};state.incomes=state.incomes||[];if(id){const item=state.incomes.find(x=>x.id===id);if(item)Object.assign(item,payload)}else state.incomes.push({id:crypto.randomUUID(),createdAt:new Date().toISOString(),...payload});safeClose($("v22CleaningDialog"));await persist(id?'Limpeza atualizada':'Limpeza registrada')}

function renderUpdatesV22(){const panel=q('#updatesDialog .updates-panel');if(!panel)return;const header=q('.updates-header',panel);qa(':scope > *',panel).forEach(x=>{if(x!==header)x.remove()});const current=RELEASE_NOTES[0];const top=document.createElement('section');top.className='v218-current-release';top.innerHTML=`<span>${current.version}</span><div><small>VERSÃO INSTALADA</small><strong>Nosso Controle ${current.version}</strong><p>${current.title}</p></div><b>Atual</b>`;panel.appendChild(top);const history=document.createElement('section');history.className='v218-release-list';history.innerHTML=RELEASE_NOTES.map((r,i)=>`<article class="${i===0?'current':''}"><header><span>Versão ${r.version}${i===0?' · Atual':''}</span><time>${r.date}</time></header><h3>${r.title}</h3><ul>${r.changes.map(c=>`<li>${escapeText(c)}</li>`).join('')}</ul></article>`).join('');panel.appendChild(history);qa('.updates-version-badge,.settings-version').forEach(x=>x.textContent=APP_VERSION)}
function prepareSettings(){const sheet=$("settingsSheet");if(!sheet)return;sheet.classList.add('v218-settings-fixed');qa('.updates-version-badge,.settings-version').forEach(x=>x.textContent=APP_VERSION)}

const baseRender=render;
render=function(){
  try{normalizeBillDepositsV404();baseRender()}catch(error){fatalDiagnostic313("Renderização principal",error);throw error}
  try{renderCleanDashboard()}catch(error){fatalDiagnostic313("Dashboard premium",error)}
  try{renderCleanBills()}catch(error){fatalDiagnostic313("Bills premium",error)}
  try{renderUpdatesV22()}catch(error){fatalDiagnostic313("Atualizações",error)}
  try{prepareSettings()}catch(error){fatalDiagnostic313("Configurações",error)}
  document.getElementById("billFunds313")?.remove();
};
window.addEventListener('pageshow',()=>{const d=$("updatesDialog");if(d?.open)safeClose(d)});
ensureCleaningDialog();prepareSettings();renderUpdatesV22();


/* Nosso Controle 3.1.0 — menu, compartilhamento e diagnóstico reconstruídos */
const diagnosticLines310=[];

function diagnosticAdd310(label,value){
  const time=new Date().toLocaleTimeString("pt-BR",{
    hour:"2-digit",minute:"2-digit",second:"2-digit"
  });
  const text=value===undefined
    ? `[${time}] ${label}`
    : `[${time}] ${label}: ${typeof value==="string" ? value : JSON.stringify(value,null,2)}`;
  diagnosticLines310.push(text);
  const log=$("diagnosticLog");
  if(log)log.textContent=diagnosticLines310.join("\n");
  console.log("[Nosso Controle diagnóstico]",label,value??"");
}

function diagnosticError310(step,error){
  diagnosticAdd310(`❌ ${step}`,error?.message||String(error||"Erro desconhecido"));
  if(error?.code)diagnosticAdd310("Código",error.code);
  if(error?.details)diagnosticAdd310("Detalhes",error.details);
  if(error?.hint)diagnosticAdd310("Sugestão",error.hint);
  console.error(`[Diagnóstico] ${step}`,error);
}

function openSettings310(){
  const sheet=$("settingsSheet");
  if(!sheet)return;
  sheet.classList.remove("hidden");
  sheet.setAttribute("aria-hidden","false");
  document.body.classList.add("settings-open-310");
}

function closeSettings310(){
  const sheet=$("settingsSheet");
  if(!sheet)return;
  sheet.classList.add("hidden");
  sheet.setAttribute("aria-hidden","true");
  document.body.classList.remove("settings-open-310");
}

function updateShareCard310(){
  const text=$("groupCodeText");
  if(text)text.textContent=householdCode||"Código indisponível";
}

async function copyHouseCode310(){
  const code=householdCode||"";
  if(!code){
    toast("Código da casa indisponível");
    return;
  }
  try{
    await navigator.clipboard.writeText(code);
    toast("Código da casa copiado");
  }catch{
    prompt("Copie o código da casa:",code);
  }
}

function openDiagnostic310(){
  closeSettings310();
  const dialog=$("diagnosticDialog");
  if(!dialog)return;
  try{dialog.showModal()}catch{dialog.setAttribute("open","")}
}

function closeDiagnostic310(){
  const dialog=$("diagnosticDialog");
  if(!dialog)return;
  try{dialog.close()}catch{dialog.removeAttribute("open")}
}

async function runDiagnostic310(){
  diagnosticLines310.length=0;
  diagnosticAdd310("================================");
  diagnosticAdd310("NOSSO CONTROLE 3.1.0");
  diagnosticAdd310("================================");
  diagnosticAdd310("Online",navigator.onLine?"SIM":"NÃO");
  diagnosticAdd310("URL",location.href);

  if(typeof sb==="undefined"||!sb){
    diagnosticAdd310("❌ Cliente Supabase não inicializado");
    return;
  }
  diagnosticAdd310("✅ Cliente Supabase inicializado");

  let sessionResponse;
  try{
    sessionResponse=await sb.auth.getSession();
  }catch(error){
    diagnosticError310("Consultar sessão",error);
    return;
  }

  if(sessionResponse.error){
    diagnosticError310("Sessão",sessionResponse.error);
    return;
  }

  const session=sessionResponse.data?.session;
  if(!session?.user){
    diagnosticAdd310("❌ Nenhuma sessão ativa");
    return;
  }

  diagnosticAdd310("✅ Login ativo");
  diagnosticAdd310("User ID",session.user.id);
  diagnosticAdd310("E-mail",session.user.email||"—");

  let member;
  try{
    member=await sb
      .from("household_members")
      .select("household_id")
      .eq("user_id",session.user.id)
      .maybeSingle();
  }catch(error){
    diagnosticError310("household_members",error);
    return;
  }

  if(member.error){
    diagnosticError310("household_members",member.error);
    return;
  }
  if(!member.data?.household_id){
    diagnosticAdd310("❌ Nenhum vínculo de casa encontrado");
    return;
  }

  const houseId=member.data.household_id;
  diagnosticAdd310("✅ Household ID",houseId);

  const house=await sb
    .from("households")
    .select("code")
    .eq("id",houseId)
    .maybeSingle();

  if(house.error){
    diagnosticError310("households",house.error);
  }else{
    diagnosticAdd310("✅ Código da casa",house.data?.code||"SEM CÓDIGO");
  }

  const finance=await sb
    .from("finance_state")
    .select("data")
    .eq("household_id",houseId)
    .maybeSingle();

  if(finance.error){
    diagnosticError310("finance_state",finance.error);
    return;
  }
  if(!finance.data?.data){
    diagnosticAdd310("❌ finance_state sem dados");
    return;
  }

  const data=finance.data.data;
  diagnosticAdd310("✅ finance_state carregado");
  diagnosticAdd310("Bills",Array.isArray(data.bills)?data.bills.length:"campo inválido");
  diagnosticAdd310("Receitas",Array.isArray(data.incomes)?data.incomes.length:"campo inválido");
  diagnosticAdd310("Gastos",Array.isArray(data.expenses)?data.expenses.length:"campo inválido");
  diagnosticAdd310("Cofre",Array.isArray(data.vaultEntries)?data.vaultEntries.length:"campo inválido");
  diagnosticAdd310("✅ Diagnóstico concluído");
}

async function copyDiagnostic310(){
  const text=diagnosticLines310.join("\n")||$("diagnosticLog")?.textContent||"Sem log";
  try{
    await navigator.clipboard.writeText(text);
    toast("Log copiado");
  }catch{
    prompt("Copie o log:",text);
  }
}

function bindStableControls310(){
  const menu=$("menuButton");
  if(menu && !menu.dataset.bound310){
    menu.dataset.bound310="1";
    menu.onclick=(event)=>{
      event.preventDefault();
      openSettings310();
    };
  }

  const close=$("closeSettings");
  if(close && !close.dataset.bound310){
    close.dataset.bound310="1";
    close.onclick=(event)=>{
      event.preventDefault();
      closeSettings310();
    };
  }

  const sheet=$("settingsSheet");
  if(sheet && !sheet.dataset.bound310){
    sheet.dataset.bound310="1";
    sheet.onclick=(event)=>{
      if(event.target===sheet)closeSettings310();
    };
  }

  const share=$("copyCode");
  if(share && !share.dataset.bound310){
    share.dataset.bound310="1";
    share.onclick=(event)=>{
      event.preventDefault();
      copyHouseCode310();
    };
  }

  const openDiagnostic=$("openDiagnosticBtn");
  if(openDiagnostic && !openDiagnostic.dataset.bound310){
    openDiagnostic.dataset.bound310="1";
    openDiagnostic.onclick=(event)=>{
      event.preventDefault();
      openDiagnostic310();
    };
  }

  const closeDiagnostic=$("closeDiagnosticBtn");
  if(closeDiagnostic && !closeDiagnostic.dataset.bound310){
    closeDiagnostic.dataset.bound310="1";
    closeDiagnostic.onclick=(event)=>{
      event.preventDefault();
      closeDiagnostic310();
    };
  }

  const runDiagnostic=$("runDiagnosticBtn");
  if(runDiagnostic && !runDiagnostic.dataset.bound310){
    runDiagnostic.dataset.bound310="1";
    runDiagnostic.onclick=runDiagnostic310;
  }

  const copyDiagnostic=$("copyDiagnosticBtn");
  if(copyDiagnostic && !copyDiagnostic.dataset.bound310){
    copyDiagnostic.dataset.bound310="1";
    copyDiagnostic.onclick=copyDiagnostic310;
  }

  updateShareCard310();
}

document.addEventListener("DOMContentLoaded",bindStableControls310);
window.addEventListener("pageshow",()=>setTimeout(bindStableControls310,50));
setTimeout(bindStableControls310,250);


window.addEventListener("error",event=>{
  fatalDiagnostic313("Erro JavaScript global",event.error||new Error(event.message),{
    arquivo:event.filename||"—",
    linha:event.lineno||"—",
    coluna:event.colno||"—"
  });
});
window.addEventListener("unhandledrejection",event=>{
  const reason=event.reason instanceof Error?event.reason:new Error(String(event.reason));
  fatalDiagnostic313("Promise rejeitada",reason);
});
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("copyFatalLoginDiagnostic")?.addEventListener("click",async()=>{
    const value=document.getElementById("fatalLoginDiagnosticText")?.textContent||"Sem detalhes";
    try{await navigator.clipboard.writeText(value);toast("Detalhes copiados")}
    catch{prompt("Copie os detalhes:",value)}
  });
});


$("resetFinance").onclick=async()=>{
  if(!confirm("Zerar Envelope, Cartão e todas as reservas das Bills?\n\nAs contas continuarão cadastradas."))return;
  if(!confirm("Confirme novamente: os valores reservados serão zerados."))return;

  const button=$("resetFinance");
  const originalText=button?.textContent||"Zerar reservas e depósitos";
  if(button){
    button.disabled=true;
    button.textContent="Zerando…";
  }

  const backup=structuredClone(state);

  try{
    state.cash=0;
    state.card=0;
    state.bills=(Array.isArray(state.bills)?state.bills:[]).map(b=>({
      ...b,
      reserved:0,
      saved:0,
      allocated:0,
      paidAmount:0
    }));
    state.dailyGoal=calculateFixedWorkdayGoal321(state.bills);
    state.updatedAt=new Date().toISOString();

    const payload=structuredClone(state);
    const {error}=await sb
      .from("finance_state")
      .update({
        data:payload,
        updated_at:payload.updatedAt
      })
      .eq("household_id",householdId);

    if(error)throw error;

    render();
    $("settingsSheet")?.classList.add("hidden");
    toast("Reservas e depósitos zerados");
  }catch(error){
    state=backup;
    render();

    fatalDiagnostic313("Reset 3.2.0",error,{
      household_id:householdId||"—"
    });
    alert(`Erro ao zerar:\n\n${error?.message||error?.code||String(error)}`);
  }finally{
    if(button){
      button.disabled=false;
      button.textContent=originalText;
    }
  }
};


async function legacyClearBillHistory402(){
  const history=Array.isArray(state?.history)?state.history:[];
  const billTypes=new Set([
    "bill_payment",
    "bill_deleted",
    "bill_deposit",
    "bill_reserved",
    "bill_created",
    "bill_updated"
  ]);

  const isBillHistory=item=>{
    const type=String(item?.type||"");
    const text=String(item?.text||"").toLowerCase();

    return billTypes.has(type) ||
      Boolean(item?.bill) ||
      text.includes("bill") ||
      text.includes("conta paga") ||
      text.includes("reservado para") ||
      text.includes("depósito adicionado");
  };

  const count=history.filter(isBillHistory).length;
  if(!count){
    toast("O histórico de Bills já está vazio");
    return;
  }

  if(!confirm(`Limpar ${count} atividades de Bills?\n\nAs Bills, reservas e saldos não serão alterados.`)){
    return;
  }

  const backup=structuredClone(history);
  const button=$("clearBillHistoryBtn");
  const original=button?.textContent||"Limpar histórico";

  try{
    if(button){
      button.disabled=true;
      button.textContent="Limpando…";
    }

    state.history=history.filter(item=>!isBillHistory(item));
    state.updatedAt=new Date().toISOString();

    const payload=structuredClone(state);
    const {error}=await sb
      .from("finance_state")
      .update({
        data:payload,
        updated_at:payload.updatedAt
      })
      .eq("household_id",householdId);

    if(error)throw error;

    render();
    toast("Histórico de Bills limpo");
  }catch(error){
    state.history=backup;
    render();
    fatalDiagnostic313("Limpar histórico de Bills 4.0.2",error,{
      household_id:householdId||"—"
    });
    alert(`Erro ao limpar histórico:\n\n${error?.message||error?.code||String(error)}`);
  }finally{
    if(button){
      button.disabled=false;
      button.textContent=original;
    }
  }
};


function bindV403Actions(){
  const clear=$("clearBillHistoryBtn");
  if(clear&&!clear.dataset.bound403){
    clear.dataset.bound403="1";
    clear.addEventListener("click",async event=>{
      event.preventDefault();
      if(typeof clearBillHistoryV403==="function"){
        await clearBillHistoryV403();
      }
    });
  }
}

async function clearBillHistoryV403(){
  const history=Array.isArray(state?.history)?state.history:[];
  const isBillEntry=item=>{
    const type=String(item?.type||"").toLowerCase();
    const text=String(item?.text||"").toLowerCase();
    return type.startsWith("bill_") ||
      Boolean(item?.bill) ||
      text.includes("bill") ||
      text.includes("conta paga") ||
      text.includes("reservado");
  };

  const count=history.filter(isBillEntry).length;
  if(!count){
    toast("O histórico de Bills já está vazio");
    return;
  }

  if(!confirm(`Limpar ${count} atividades de Bills?`))return;

  const backup=structuredClone(history);
  try{
    state.history=history.filter(item=>!isBillEntry(item));
    state.updatedAt=new Date().toISOString();

    const {error}=await sb
      .from("finance_state")
      .update({data:structuredClone(state),updated_at:state.updatedAt})
      .eq("household_id",householdId);

    if(error)throw error;
    render();
    toast("Histórico de Bills limpo");
  }catch(error){
    state.history=backup;
    render();
    fatalDiagnostic313("Limpar histórico 4.0.3",error);
    alert(`Erro ao limpar histórico:\n\n${error?.message||String(error)}`);
  }
}

window.addEventListener("pageshow",()=>setTimeout(bindV403Actions,100));
document.addEventListener("DOMContentLoaded",()=>setTimeout(bindV403Actions,100));


let statisticsDateV410=new Date();
function monthKeyV410(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`}
function amountFromHistoryV410(x){return Number(x?.amount||0)||(Number(x?.cash||0)+Number(x?.card||0))}
function monthlyStatisticsV410(date=statisticsDateV410){
  const key=monthKeyV410(date),inc=(state.incomes||[]).filter(x=>String(x.date||"").slice(0,7)===key),exp=(state.expenses||[]).filter(x=>String(x.date||"").slice(0,7)===key),vault=(state.vaultEntries||[]).filter(x=>String(x.date||"").slice(0,7)===key),hist=(state.history||[]).filter(x=>localDateKeyV410(x.date).slice(0,7)===key),dep=hist.filter(x=>String(x.type||"")==="bill_deposit"),pay=hist.filter(x=>String(x.type||"")==="bill_payment");
  const incomeTotal=inc.reduce((s,x)=>s+Number(x.amount||0),0),expenseTotal=exp.reduce((s,x)=>s+Number(x.amount||0),0),depositTotal=dep.reduce((s,x)=>s+amountFromHistoryV410(x),0),paymentsTotal=pay.reduce((s,x)=>s+amountFromHistoryV410(x),0),vaultNet=vault.reduce((s,x)=>s+(x.type==="withdrawal"?-Number(x.amount||0):Number(x.amount||0)),0);
  const days={};dep.forEach(x=>{const k=localDateKeyV410(x.date);days[k]=(days[k]||0)+amountFromHistoryV410(x)});const goal=calculateFixedWorkdayGoal321(state.bills||[]);
  const events=[...inc.map(x=>({date:x.date,type:"Receita",description:x.description||x.client||"Receita",amount:Number(x.amount||0),tone:"added"})),...exp.map(x=>({date:x.date,type:"Gasto",description:x.description||expenseNames[x.category]||"Gasto",amount:-Number(x.amount||0),tone:"removed"})),...dep.map(x=>({date:x.date,type:"Depósito Bills",description:x.bill||"Distribuição automática",amount:amountFromHistoryV410(x),tone:"added"})),...pay.map(x=>({date:x.date,type:"Bill paga",description:x.bill||x.text||"Bill",amount:-amountFromHistoryV410(x),tone:"removed"})),...vault.map(x=>({date:x.date,type:x.type==="withdrawal"?"Retirada Cofre":"Depósito Cofre",description:x.description||x.note||"Cofre",amount:x.type==="withdrawal"?-Number(x.amount||0):Number(x.amount||0),tone:x.type==="withdrawal"?"removed":"added"}))].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return {key,incomeTotal,expenseTotal,depositTotal,paymentsTotal,vaultNet,goal,depositDays:Object.keys(days).length,goalDays:Object.values(days).filter(v=>goal>0&&v>=goal).length,events,balance:incomeTotal-expenseTotal-paymentsTotal+vaultNet};
}
function renderStatisticsV410(){
  const d=monthlyStatisticsV410(),label=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(statisticsDateV410);
  $("statsMonthLabelV410").textContent=label;$("statsIncomeV410").textContent=money(d.incomeTotal);$("statsExpensesV410").textContent=money(d.expenseTotal);$("statsBillsPaidV410").textContent=money(d.paymentsTotal);$("statsVaultV410").textContent=money(d.vaultNet);$("statsDepositsV410").textContent=money(d.depositTotal);$("statsBalanceV410").textContent=money(d.balance);$("statsDailyGoalV410").textContent=money(d.goal);$("statsDepositDaysV410").textContent=String(d.depositDays);$("statsGoalDaysV410").textContent=String(d.goalDays);
  $("statisticsHistoryV410").innerHTML=d.events.length?d.events.map(x=>`<article class="statistics-history-item-v410 ${x.tone}"><div><strong>${escapeText(x.description)}</strong><small>${escapeText(x.type)} · ${new Date(x.date).toLocaleDateString("pt-BR")}</small></div><b>${x.amount>=0?"+":"−"}${money(Math.abs(x.amount))}</b></article>`).join(""):'<div class="empty-state">Nenhuma movimentação neste mês.</div>';
}
function openStatisticsV410(){statisticsDateV410=new Date();renderStatisticsV410();$("statisticsDialogV410").showModal()}
function printStatisticsPdfV410(){
  const d=monthlyStatisticsV410(),label=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(statisticsDateV410),rows=d.events.map(x=>`<tr><td>${new Date(x.date).toLocaleDateString("pt-BR")}</td><td>${escapeText(x.type)}</td><td>${escapeText(x.description)}</td><td>${x.amount>=0?"+":"-"}${money(Math.abs(x.amount))}</td></tr>`).join(""),popup=window.open("","_blank");
  if(!popup)return alert("Permita pop-ups para gerar o PDF.");
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Nosso Controle - ${label}</title><style>body{font-family:Arial,sans-serif;margin:36px;color:#111}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.card{border:1px solid #ddd;border-radius:10px;padding:12px}table{width:100%;border-collapse:collapse;margin-top:22px;font-size:11px}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}td:last-child{text-align:right;font-weight:bold}</style></head><body><h1>Nosso Controle</h1><p>Relatório financeiro - ${label}</p><div class="grid"><div class="card">Receitas<br><b>${money(d.incomeTotal)}</b></div><div class="card">Gastos<br><b>${money(d.expenseTotal)}</b></div><div class="card">Bills pagas<br><b>${money(d.paymentsTotal)}</b></div><div class="card">Depósitos Bills<br><b>${money(d.depositTotal)}</b></div><div class="card">Cofre líquido<br><b>${money(d.vaultNet)}</b></div><div class="card">Resultado<br><b>${money(d.balance)}</b></div></div><table><thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>${rows||'<tr><td colspan="4">Nenhuma movimentação.</td></tr>'}</tbody></table><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);popup.document.close();
}
function exportStatisticsCsvV410(){const d=monthlyStatisticsV410(),csv=[["Data","Tipo","Descrição","Valor"],...d.events.map(x=>[localDateKeyV410(x.date),x.type,x.description,x.amount.toFixed(2)])].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n"),blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`nosso-controle-historico-${d.key}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}


function bindV410Features(){
  const once=(id,event,fn)=>{const el=$(id);if(el&&!el.dataset[`v410${event}`]){el.dataset[`v410${event}`]="1";el.addEventListener(event,fn)}};
  once("openCalendar","click",openCalendar);once("closeCalendar","click",()=>$("calendarDialog").close());
  once("calendarPrev","click",()=>{calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()-1,1);renderCalendar()});
  once("calendarNext","click",()=>{calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+1,1);renderCalendar()});
  once("closeDayDetails","click",()=>$("dayDetailsDialog").close());
  once("closeStatisticsV410","click",()=>$("statisticsDialogV410").close());
  once("statsPrevMonthV410","click",()=>{statisticsDateV410=new Date(statisticsDateV410.getFullYear(),statisticsDateV410.getMonth()-1,1);renderStatisticsV410()});
  once("statsNextMonthV410","click",()=>{statisticsDateV410=new Date(statisticsDateV410.getFullYear(),statisticsDateV410.getMonth()+1,1);renderStatisticsV410()});
  once("printStatisticsPdfV410","click",printStatisticsPdfV410);once("exportStatisticsCsvV410","click",exportStatisticsCsvV410);
  once("runCloudBackupV410","click",()=>uploadAutomaticBackupV410({force:true,silent:false}));
  once("chooseBackupFileV410","click",()=>$("backupFileInputV410").click());
  once("backupFileInputV410","change",e=>{importBackupFileV410(e.target.files?.[0]);e.target.value=""});
  if($("v22Stats"))$("v22Stats").onclick=openStatisticsV410;
}
document.addEventListener("DOMContentLoaded",()=>setTimeout(bindV410Features,100));window.addEventListener("pageshow",()=>setTimeout(bindV410Features,150));

boot();


/* =====================================================
   NOSSO CONTROLE 5.0.0-BETA.2
   ROUTE CRM — BUILD COMPILADO
   Fonte organizada internamente em módulos.
   ===================================================== */


/* ----- route-utils.js ----- */
(() => {
  "use strict";
  const R = window.RouteV5 = window.RouteV5 || {};
  R.VERSION = "5.0.0-beta.2";
  R.DAY_NAMES = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  R.DAY_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  R.$ = id => document.getElementById(id);
  R.clone = value => structuredClone(value);
  R.id = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  R.pad = value => String(value).padStart(2,"0");
  R.key = date => `${date.getFullYear()}-${R.pad(date.getMonth()+1)}-${R.pad(date.getDate())}`;
  R.date = key => {
    const [y,m,d] = String(key).split("-").map(Number);
    return new Date(y,m-1,d,12,0,0,0);
  };
  R.addDays = (date,days) => { const d=new Date(date); d.setDate(d.getDate()+days); return d; };
  R.weekStart = value => {
    const d=new Date(value); d.setHours(12,0,0,0);
    d.setDate(d.getDate()+(d.getDay()===0?-6:1-d.getDay()));
    return d;
  };
  R.weekDiff = (a,b) => Math.round((R.weekStart(a)-R.weekStart(b))/(7*86400000));
  R.mondayIndex = day => day===0?6:day-1;
  R.weekday = index => index===6?0:index+1;
  R.today = () => R.key(new Date());
  R.money = value => typeof money==="function" ? money(Number(value||0)) : `£${Number(value||0).toFixed(2)}`;
  R.escape = value => typeof escapeText==="function" ? escapeText(String(value??"")) : String(value??"");
  R.daysLate = dateKey => Math.max(0,Math.floor((R.date(R.today())-R.date(dateKey))/86400000));
  R.formatDate = key => R.date(key).toLocaleDateString("pt-BR");
  R.feedback = (id,message) => {
    const node=R.$(id); if(node)node.textContent=message||"";
  };
})();


/* ----- route-data.js ----- */
(() => {
  "use strict";
  const R=window.RouteV5;

  R.ensure = () => {
    if(!state)return null;
    state.incomes=Array.isArray(state.incomes)?state.incomes:[];
    state.expenses=Array.isArray(state.expenses)?state.expenses:[];
    state.bills=Array.isArray(state.bills)?state.bills:[];
    state.vaultEntries=Array.isArray(state.vaultEntries)?state.vaultEntries:[];
    state.route = state.route && typeof state.route==="object" ? state.route : {};
    state.route.clients = Array.isArray(state.route.clients) ? state.route.clients : [];
    state.route.visits = Array.isArray(state.route.visits) ? state.route.visits : [];
    state.incomes = Array.isArray(state.incomes) ? state.incomes : [];
    return state.route;
  };

  R.clients = () => (R.ensure()?.clients||[]).filter(c=>c.active!==false);
  R.client = id => (R.ensure()?.clients||[]).find(c=>String(c.id)===String(id));
  R.override = (clientId,originalDate) =>
    (R.ensure()?.visits||[]).find(v=>String(v.clientId)===String(clientId)&&v.originalDate===originalDate);

  R.isScheduled = (client,date) => {
    if(client.active===false || Number(client.day)!==date.getDay())return false;
    const anchor=R.date(client.anchorDate||R.key(date));
    if(client.frequency==="extra")return false;
    if(client.frequency==="once")return R.key(date)===R.key(anchor);
    if(date<R.weekStart(anchor))return false;
    return client.frequency!=="fortnightly" || Math.abs(R.weekDiff(date,anchor))%2===0;
  };

  R.instance = (client,originalDate) => {
    const originalKey = typeof originalDate==="string" ? originalDate : R.key(originalDate);
    const visit = R.override(client.id,originalKey);
    const actualDate = visit?.actualDate || originalKey;
    const hours = Number(visit?.hours ?? client.hours ?? 0);
    const hourlyRate = Number(visit?.hourlyRate ?? client.hourlyRate ?? 0);
    const costPerHour = Number(client.costPerHour||0);
    const extraCost = Number(client.extraCost||0);
    return {
      key:`${client.id}:${originalKey}`,
      clientId:String(client.id),
      client,
      originalDate:originalKey,
      actualDate,
      hours,
      hourlyRate,
      order:Number(visit?.order ?? client.order ?? 1),
      amount:hours*hourlyRate,
      estimatedCost:hours*costPerHour+extraCost,
      estimatedProfit:hours*hourlyRate-(hours*costPerHour+extraCost),
      cancelled:Boolean(visit?.cancelled),
      paid:Boolean(visit?.paid),
      paymentMethod:visit?.paymentMethod||"",
      amountReceived:Number(visit?.amountReceived||0),
      paymentDate:visit?.paymentDate||"",
      visit
    };
  };

  R.instances = (start,end) => {
    const result=[],seen=new Set();
    for(const client of R.clients()){
      for(let date=new Date(start);date<=end;date=R.addDays(date,1)){
        if(!R.isScheduled(client,date))continue;
        const item=R.instance(client,date);
        const actual=R.date(item.actualDate);
        if(actual>=start&&actual<=end){result.push(item);seen.add(item.key);}
      }
    }
    for(const visit of R.ensure().visits){
      if(!visit.actualDate)continue;
      const actual=R.date(visit.actualDate);
      if(actual<start||actual>end)continue;
      const key=`${visit.clientId}:${visit.originalDate}`;
      if(seen.has(key))continue;
      const client=R.client(visit.clientId);
      if(client)result.push(R.instance(client,visit.originalDate));
    }
    return result.sort((a,b)=>
      a.actualDate.localeCompare(b.actualDate) ||
      a.order-b.order ||
      a.client.name.localeCompare(b.client.name)
    );
  };

  R.isOverdue = item =>
    !item.paid &&
    !item.cancelled &&
    R.date(item.actualDate).getTime() < R.date(R.today()).getTime();

  R.nextClientOrder = (day,excludeClientId="") => {
    const orders=R.clients()
      .filter(client=>
        Number(client.day)===Number(day) &&
        String(client.id)!==String(excludeClientId)
      )
      .map(client=>Number(client.order||0))
      .filter(order=>order>0);
    return orders.length ? Math.max(...orders)+1 : 1;
  };

  R.nextVisitOrder = (dateKey,excludeVisitKey="") => {
    const day=R.date(dateKey).getDay();
    const week=R.weekStart(R.date(dateKey));
    const items=R.instances(week,R.addDays(week,6))
      .filter(item=>
        item.actualDate===dateKey &&
        item.key!==excludeVisitKey &&
        !item.cancelled
      );
    const orders=items.map(item=>Number(item.order||0)).filter(order=>order>0);
    return orders.length ? Math.max(...orders)+1 : 1;
  };

  R.normalizeClientOrders = day => {
    const clients=R.clients()
      .filter(client=>Number(client.day)===Number(day))
      .sort((a,b)=>Number(a.order||999)-Number(b.order||999)||a.name.localeCompare(b.name));
    clients.forEach((client,index)=>client.order=index+1);
  };

  R.fromKey = key => {
    const split=String(key).split(":");
    const client=R.client(split.shift());
    return client ? R.instance(client,split.join(":")) : null;
  };

  R.upsertVisit = (item,updates) => {
    let visit=R.override(item.clientId,item.originalDate);
    if(!visit){
      visit={id:R.id(),clientId:item.clientId,originalDate:item.originalDate,actualDate:item.originalDate,createdAt:new Date().toISOString()};
      R.ensure().visits.push(visit);
    }
    Object.assign(visit,updates,{updatedAt:new Date().toISOString()});
    return visit;
  };

  R.restoreVisit = item => {
    R.ensure().visits=R.ensure().visits.filter(v=>!(String(v.clientId)===item.clientId&&v.originalDate===item.originalDate));
  };

  R.incomeId = item => `route-income:${item.key}`;
  R.syncIncome = (item,visit) => {
    R.ensure();
    state.incomes=Array.isArray(state.incomes)?state.incomes:[];
    const incomeId=R.incomeId(item);

    // Nunca duplica: primeiro remove a receita antiga desta limpeza.
    state.incomes=state.incomes.filter(income=>
      String(income.id)!==String(incomeId) &&
      String(income.routeVisitKey||"")!==String(item.key)
    );

    // Se o pagamento foi removido, a receita também desaparece da aba Geral.
    if(!visit?.paid)return;

    const amount=Number(visit.amountReceived ?? item.amount ?? 0);
    const paymentDate=visit.paymentDate || visit.actualDate || item.actualDate || R.today();
    const paymentMethod=visit.paymentMethod || "card";

    state.incomes.push({
      id:incomeId,
      amount,
      description:`Limpeza · ${item.client.name}`,
      person:"casal",
      date:paymentDate,
      source:"route",
      category:"Limpeza",
      routeVisitKey:item.key,
      routeClientId:item.clientId,
      paymentMethod,
      method:paymentMethod,
      createdAt:visit.createdAt || new Date().toISOString(),
      updatedAt:new Date().toISOString()
    });
  };
  R.reconcileRouteIncomesV514 = () => {
    if(!state)return;
    R.ensure();

    const routeKeys=new Set();
    for(const visit of R.ensure().visits||[]){
      const client=R.client(visit.clientId);
      if(!client)continue;
      const item=R.instance(client,visit.originalDate);
      routeKeys.add(item.key);
      if(visit.paid)R.syncIncome(item,visit);
      else{
        const incomeId=R.incomeId(item);
        state.incomes=(state.incomes||[]).filter(income=>
          String(income.id)!==String(incomeId) &&
          String(income.routeVisitKey||"")!==String(item.key)
        );
      }
    }

    // Remove receitas órfãs da Rota que não correspondem mais a visita existente.
    state.incomes=(state.incomes||[]).filter(income=>
      income.source!=="route" ||
      !income.routeVisitKey ||
      routeKeys.has(String(income.routeVisitKey))
    );
  };

  R.clientHistory = clientId => {
    const visits=(R.ensure()?.visits||[])
      .filter(v=>String(v.clientId)===String(clientId))
      .map(v=>R.instance(R.client(clientId),v.originalDate))
      .filter(Boolean)
      .sort((a,b)=>new Date(b.paymentDate||b.actualDate)-new Date(a.paymentDate||a.actualDate));
    return visits;
  };
})();


/* ----- route-clients.js ----- */
(() => {
  "use strict";
  const R=window.RouteV5;

  R.nextOrder = day => {
    const orders=R.clients().filter(c=>Number(c.day)===Number(day)).map(c=>Number(c.order||0));
    return orders.length?Math.max(...orders)+1:1;
  };

  R.previewClient = () => {
    const rate=Number(R.$("routeClientRateV5").value||0);
    const hours=Number(R.$("routeClientHoursV5").value||0);
    R.$("routeClientAmountPreviewV5").textContent=R.money(rate*hours);
  };

  R.toggleExtraClientFieldsV510 = () => {
    const extra=R.$("routeClientFrequencyV5").value==="extra";
    ["routeClientDayWrapV510","routeClientOrderWrapV510"].forEach(id=>R.$(id)?.classList.toggle("hidden",extra));
    R.$("routeClientAnchorWrapV510")?.classList.remove("hidden");
  };

  R.openClient = client => {
    R.ensure();
    const day=client?.day ?? R.weekday(R.ui.selectedDay);
    R.$("routeClientIdV5").value=client?.id||"";
    R.$("routeClientDialogTitleV5").textContent=client?"Editar cliente":"Novo cliente";
    R.$("routeClientNameV5").value=client?.name||"";
    R.$("routeClientDayV5").value=String(day);
    R.$("routeClientOrderV5").value=client?.order?String(client.order):"";
    R.$("routeClientFrequencyV5").value=client?.frequency||"weekly";
    R.$("routeClientAnchorV5").value=client?.anchorDate||R.key(R.addDays(R.ui.week,R.ui.selectedDay));
    R.toggleExtraClientFieldsV510();
    R.$("routeClientRateV5").value=client?.hourlyRate??"";
    R.$("routeClientHoursV5").value=client?.hours??"";
    R.$("routeClientStartTimeV6").value=client?.startTime||"";
    R.$("routeClientPostcodeV6").value=client?.postcode||"";
    R.$("routeClientNotesV604").value=client?.notes||"";
    R.$("duplicateRouteClientV5").classList.toggle("hidden",!client);
    R.$("deleteRouteClientV5").classList.toggle("hidden",!client);
    R.feedback("routeClientFeedbackV5","");
    R.previewClient();
    R.$("routeClientDialogV5").showModal();
  };

  R.saveClient = async () => {
    R.feedback("routeClientFeedbackV5","");
    const name=R.$("routeClientNameV5").value.trim();
    const frequency=R.$("routeClientFrequencyV5").value;
    const isExtra=frequency==="extra";
    const anchorDate=R.$("routeClientAnchorV5").value;
    const anchorDay=anchorDate?R.date(anchorDate).getDay():null;
    const day=isExtra?anchorDay:Number(R.$("routeClientDayV5").value);
    const rate=Number(R.$("routeClientRateV5").value||0);
    const hours=Number(R.$("routeClientHoursV5").value||0);
    const sequenceText=R.$("routeClientOrderV5").value.trim();
    const clientId=R.$("routeClientIdV5").value;
    const existing=clientId?R.client(clientId):null;
    const oldDay=existing?.day==null?null:Number(existing.day);

    if(!name)return R.feedback("routeClientFeedbackV5","Digite o nome do cliente.");
    if(rate<=0||hours<=0)return R.feedback("routeClientFeedbackV5","Informe valor/hora e horas.");
    if(!anchorDate)return R.feedback("routeClientFeedbackV5","Escolha a primeira data do serviço.");

    let sequence=isExtra
      ? R.nextVisitOrder(anchorDate)
      : (sequenceText?Number(sequenceText):R.nextClientOrder(day,clientId));

    if(!Number.isInteger(sequence)||sequence<1){
      return R.feedback("routeClientFeedbackV5","Digite uma sequência válida ou deixe vazio.");
    }

    const payload={
      name,
      day,
      order:isExtra?0:sequence,
      frequency,
      anchorDate,
      hourlyRate:rate,
      hours,
      startTime:R.$("routeClientStartTimeV6").value||"",
      postcode:R.$("routeClientPostcodeV6").value.trim().toUpperCase(),
      notes:R.$("routeClientNotesV604").value.trim(),
      active:true,
      updatedAt:new Date().toISOString()
    };

    try{
      let savedClient=existing;
      if(existing){
        Object.assign(existing,payload);
      }else{
        savedClient={
          id:R.id(),
          createdAt:new Date().toISOString(),
          ...payload
        };
        R.ensure().clients.push(savedClient);
      }

      if(!isExtra){
        R.clients()
          .filter(client=>
            Number(client.day)===Number(day) &&
            String(client.id)!==String(savedClient.id) &&
            Number(client.order||0)>=sequence
          )
          .forEach(client=>client.order=Number(client.order||0)+1);
        if(oldDay!==null&&oldDay!==day)R.normalizeClientOrders(oldDay);
        R.normalizeClientOrders(day);
      }else{
        const existingVisit=(R.ensure().visits||[]).find(visit=>
          String(visit.clientId)===String(savedClient.id)&&
          visit.actualDate===anchorDate
        );
        if(!existingVisit){
          const item=R.instance(savedClient,anchorDate);
          R.upsertVisit(item,{
            actualDate:anchorDate,
            order:sequence,
            extra:true,
            cancelled:false
          });
        }
      }

      R.$("routeClientDialogV5").close();
      await persist(clientId?"Cliente atualizado":"Cliente adicionado à rota");
    }catch(error){
      R.feedback("routeClientFeedbackV5",error?.message||"Não foi possível salvar o cliente.");
      if(typeof fatalDiagnostic313==="function"){
        fatalDiagnostic313("Salvar cliente da Rota 5.0.0-beta.11",error);
      }
    }
  };
  R.duplicateClient = async () => {
    const client=R.client(R.$("routeClientIdV5").value);
    if(!client)return;
    const duplicate=R.clone(client);
    duplicate.id=R.id();
    duplicate.name=`${client.name} — cópia`;
    duplicate.order=R.nextClientOrder(client.day);
    delete duplicate.favorite;
    delete duplicate.note;
    duplicate.createdAt=new Date().toISOString();
    duplicate.updatedAt=duplicate.createdAt;
    R.ensure().clients.push(duplicate);
    R.$("routeClientDialogV5").close();
    await persist("Cliente duplicado");
  };

  R.deleteClient = async () => {
    const client=R.client(R.$("routeClientIdV5").value);
    if(!client)return;

    const clientVisitKeys=(R.ensure().visits||[])
      .filter(v=>String(v.clientId)===String(client.id))
      .map(v=>`${client.id}:${v.originalDate}`);

    const message=
      `Excluir ${client.name} permanentemente?\n\n`+
      `Isso removerá o cadastro, alterações de visitas, pagamentos da Rota e receitas ligadas a esse cliente.`;

    if(!confirm(message))return;

    try{
      const deletedDay=Number(client.day);
      R.ensure().clients=R.ensure().clients.filter(c=>String(c.id)!==String(client.id));
      R.ensure().visits=R.ensure().visits.filter(v=>String(v.clientId)!==String(client.id));
      R.normalizeClientOrders(deletedDay);
      state.incomes=(state.incomes||[]).filter(income=>
        income.source!=="route" ||
        !clientVisitKeys.includes(String(income.routeVisitKey||""))
      );

      R.$("routeClientDialogV5").close();
      await persist("Cliente excluído permanentemente");
    }catch(error){
      if(typeof fatalDiagnostic313==="function"){
        fatalDiagnostic313("Excluir cliente permanentemente 5.0.0-beta.4",error,{client_id:client.id});
      }
      alert(`Não foi possível excluir o cliente:\n\n${error?.message||String(error)}`);
    }
  };
})();


/* ----- route-payments.js ----- */
(() => {
  "use strict";
  const R=window.RouteV5;

  R.openPayment = item => {
    const current=R.fromKey(item.key);
    R.$("routePaymentKeyV5").value=current.key;
    R.$("routePaymentClientV5").textContent=`${current.client.name} · ${R.formatDate(current.actualDate)}`;
    R.$("routePaymentExpectedV5").textContent=R.money(current.amount);
    R.$("routePaymentAmountV5").value=(current.paid?current.amountReceived:current.amount).toFixed(2);
    R.$("routePaymentMethodV5").value=current.paymentMethod||"card";
    R.$("routePaymentDateV5").value=current.paymentDate||current.actualDate;
    R.$("removeRoutePaymentV5").classList.toggle("hidden",!current.paid);
    R.feedback("routePaymentFeedbackV5","");
    R.$("routePaymentDialogV5").showModal();
  };

  R.savePayment = async () => {
    const item=R.fromKey(R.$("routePaymentKeyV5").value);
    const amount=Number(R.$("routePaymentAmountV5").value||0);
    if(!item||amount<=0)return R.feedback("routePaymentFeedbackV5","Digite o valor recebido.");
    const visit=R.upsertVisit(item,{
      paid:true,
      amountReceived:amount,
      paymentMethod:R.$("routePaymentMethodV5").value,
      paymentDate:R.$("routePaymentDateV5").value||R.today()
    });
    R.syncIncome(item,visit);
    R.$("routePaymentDialogV5").close();
    await persist("Pagamento confirmado");
  };

  R.removePayment = async () => {
    const item=R.fromKey(R.$("routePaymentKeyV5").value);
    if(!item||!confirm("Desmarcar este pagamento?"))return;
    const visit=R.upsertVisit(item,{paid:false,amountReceived:0,paymentMethod:"",paymentDate:""});
    R.syncIncome(item,visit);
    R.$("routePaymentDialogV5").close();
    await persist("Pagamento desmarcado");
  };
})();


/* ----- route-ui.js ----- */
(() => {
  "use strict";
  const R=window.RouteV5;
  R.ui={week:R.weekStart(new Date()),selectedDay:Math.max(0,Math.min(6,R.mondayIndex(new Date().getDay()))),search:"",filter:"all"};

  R.weekItems = () => R.instances(R.ui.week,R.addDays(R.ui.week,6));
  R.overdueItems = () => R.instances(R.addDays(R.date(R.today()),-90),R.addDays(R.date(R.today()),-1))
    .filter(R.isOverdue)
    .sort((a,b)=>a.actualDate.localeCompare(b.actualDate));

  R.filtered = items => items;


  R.render = () => {
    if(!state||!R.$("routeView"))return;
    R.ensure();
    R.reconcileRouteIncomesV514();
    const items=R.weekItems();
    const active=items.filter(x=>!x.cancelled);
    const weeklyExtra=active.filter(item=>item.client?.frequency==="extra"||item.visit?.extra);
    const weeklyPaid=active.filter(item=>item.paid);
    R.$("routeExpectedV5").textContent=R.money(active.reduce((s,x)=>s+x.amount,0));
    R.$("routeExpectedCountV512").textContent=`${active.length} ${active.length===1?"serviço":"serviços"}`;
    R.$("routeReceivedV5").textContent=R.money(weeklyPaid.reduce((s,x)=>s+x.amountReceived,0));
    R.$("routeReceivedCountV512").textContent=`${weeklyPaid.length} ${weeklyPaid.length===1?"pagamento":"pagamentos"}`;
    R.$("routeExtraWeeklyV511").textContent=R.money(weeklyExtra.reduce((sum,item)=>sum+item.amount,0));
    R.$("routeExtraWeeklyCountV511").textContent=
      `${weeklyExtra.length} ${weeklyExtra.length===1?"serviço":"serviços"}`;
    const hours=active.reduce((s,x)=>s+x.hours,0),worked=active.filter(x=>x.paid).reduce((s,x)=>s+x.hours,0);
    R.$("routeHoursV5").textContent=`${hours.toFixed(hours%1?1:0)}h`;
    R.$("routeWorkedHoursV5").textContent=`${worked.toFixed(worked%1?1:0)}h concluídas`;
    const end=R.addDays(R.ui.week,6);
    R.$("routeWeekLabelV5").textContent=R.ui.week.getTime()===R.weekStart(new Date()).getTime()?"Esta semana":"Semana selecionada";
    R.$("routeWeekRangeV5").textContent=`${R.pad(R.ui.week.getDate())}/${R.pad(R.ui.week.getMonth()+1)} — ${R.pad(end.getDate())}/${R.pad(end.getMonth()+1)}`;
    R.renderOverdue();
    R.renderMonthSummaryV56();
    R.renderBusinessAnalyticsV6();
    R.renderDays();
    R.renderSelectedDay();
  };

  R.renderOverdue = () => {
    const overdue=R.overdueItems();
    R.$("routeOverdueAmountV5").textContent=R.money(overdue.reduce((s,x)=>s+x.amount,0));
    R.$("routeOverdueCountV5").textContent=String(overdue.length);
    R.$("routeOverdueSubtitleV5").textContent=`${overdue.length} ${overdue.length===1?"cliente":"clientes"}`;
    const overdueList=R.$("routeOverdueListV5");
    overdueList.innerHTML=overdue.length?overdue.map(item=>`<article class="route-overdue-item-v5"><div><strong>${R.escape(item.client.name)}${item.client.frequency==="extra"?' <i class="route-extra-inline-v510">EXTRA</i>':''}</strong><span>${R.formatDate(item.actualDate)} · ${R.daysLate(item.actualDate)} dias de atraso</span></div><div class="route-overdue-action-v5"><b>${R.money(item.amount)}</b><button type="button" data-overdue-pay="${item.key}">Confirmar pago</button></div></article>`).join(""):'<div class="route-empty-v5"><b>Nenhum pagamento atrasado</b><span>Tudo em dia.</span></div>';
    overdueList.querySelectorAll("[data-overdue-pay]").forEach(btn=>btn.onclick=()=>R.openPayment(R.fromKey(btn.dataset.overduePay)));

    const cancelled=R.weekItems().filter(item=>item.cancelled);
    R.$("routeCancelledAmountV56").textContent=R.money(cancelled.reduce((s,x)=>s+x.amount,0));
    R.$("routeCancelledCountV56").textContent=String(cancelled.length);
    const cancelledClients=new Set(cancelled.map(item=>item.clientId)).size;
    R.$("routeCancelledSubtitleV56").textContent=`${cancelledClients} ${cancelledClients===1?"cliente":"clientes"}`;
    const cancelledList=R.$("routeCancelledListV56");
    cancelledList.innerHTML=cancelled.length?cancelled.map(item=>`<article class="route-overdue-item-v5 route-cancelled-item-v56"><div><strong>${R.escape(item.client.name)}</strong><span>${R.formatDate(item.actualDate)} · ${item.hours}h</span></div><div class="route-overdue-action-v5"><b>${R.money(item.amount)}</b><button type="button" data-cancelled-manage="${item.key}">Abrir opções</button></div></article>`).join(""):'<div class="route-empty-v5"><b>Nenhuma limpeza cancelada</b><span>Nada foi removido desta semana.</span></div>';
    cancelledList.querySelectorAll("[data-cancelled-manage]").forEach(btn=>btn.onclick=()=>R.openManage(R.fromKey(btn.dataset.cancelledManage)));
  };


  R.renderMonthSummaryV56 = () => {
    const reference=R.addDays(R.ui.week,3);
    const start=new Date(reference.getFullYear(),reference.getMonth(),1,12);
    const end=new Date(reference.getFullYear(),reference.getMonth()+1,0,12);
    const items=R.instances(start,end),active=items.filter(x=>!x.cancelled);
    const monthlyExtra=active.filter(item=>item.client?.frequency==="extra"||item.visit?.extra);
    const expected=active.reduce((s,x)=>s+x.amount,0);
    const paid=active.filter(x=>x.paid);
    const received=paid.reduce((s,x)=>s+x.amountReceived,0);
    const cash=paid.filter(x=>x.paymentMethod==="cash").reduce((s,x)=>s+x.amountReceived,0);
    const card=paid.filter(x=>x.paymentMethod!=="cash").reduce((s,x)=>s+x.amountReceived,0);
    const hours=active.reduce((s,x)=>s+x.hours,0);
    const overdueItems=items.filter(R.isOverdue);
    const overdueAmount=overdueItems.reduce((sum,item)=>sum+item.amount,0);
    const overdueClients=new Set(overdueItems.map(item=>item.clientId)).size;
    R.$("routeMonthLabelV56").textContent=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(reference);
    R.$("routeMonthRangeV56").textContent=`${R.pad(start.getDate())}/${R.pad(start.getMonth()+1)} — ${R.pad(end.getDate())}/${R.pad(end.getMonth()+1)}`;
    R.$("routeMonthExpectedV56").textContent=R.money(expected);
    R.$("routeMonthReceivedV56").textContent=R.money(received);
    R.$("routeMonthExtraV511").textContent=R.money(monthlyExtra.reduce((sum,item)=>sum+item.amount,0));
    R.$("routeMonthExtraCountV511").textContent=
      `${monthlyExtra.length} ${monthlyExtra.length===1?"serviço":"serviços"}`;
    R.$("routeMonthCashV57").textContent=R.money(cash);
    R.$("routeMonthCardV57").textContent=R.money(card);
    R.$("routeMonthHoursV56").textContent=`${hours.toFixed(hours%1?1:0)}h`;
    R.$("routeMonthOverdueAmountV59").textContent=R.money(overdueAmount);
    R.$("routeMonthOverdueCountV59").textContent=`${overdueClients} ${overdueClients===1?"cliente":"clientes"}`;
    const cancelledItems=items.filter(x=>x.cancelled);
    const cancelledAmount=cancelledItems.reduce((sum,item)=>sum+item.amount,0);
    const cancelledClients=new Set(cancelledItems.map(item=>item.clientId)).size;
    R.$("routeMonthCancelledAmountV58").textContent=R.money(cancelledAmount);
    R.$("routeMonthCancelledCountV58").textContent=
      `${cancelledClients} ${cancelledClients===1?"cliente":"clientes"}`;
  };

  R.renderBusinessAnalyticsV6 = () => {
    const today=R.date(R.today());
    const end=R.addDays(today,29);
    const future=R.instances(today,end).filter(item=>!item.cancelled);
    const forecast=future.reduce((sum,item)=>sum+item.amount,0);
    const hours=future.reduce((sum,item)=>sum+item.hours,0);
    const averageWeek=forecast/30*7;
    const averageHour=hours>0?forecast/hours:0;

    const currentMonthStart=new Date(today.getFullYear(),today.getMonth(),1,12);
    const currentMonthEnd=new Date(today.getFullYear(),today.getMonth()+1,0,12);
    const monthItems=R.instances(currentMonthStart,currentMonthEnd);
    const lostCancelled=monthItems.filter(item=>item.cancelled).reduce((sum,item)=>sum+item.amount,0);

    const activeClients=R.clients().filter(client=>client.active!==false).length;
    const byDay=[0,0,0,0,0,0,0];
    future.forEach(item=>byDay[R.date(item.actualDate).getDay()]++);
    const max=Math.max(...byDay);
    const busiest=max>0?R.DAY_NAMES[byDay.indexOf(max)]:"—";

    R.$("routeForecast30V6").textContent=R.money(forecast);
    R.$("routeAverageWeekV6").textContent=R.money(averageWeek);
    R.$("routeAverageHourV6").textContent=R.money(averageHour);
    R.$("routeLostCancelledV6").textContent=R.money(lostCancelled);
    R.$("routeActiveClientsV6").textContent=String(activeClients);
    R.$("routeBusiestDayV6").textContent=busiest;
    R.$("routeForecastHoursV6").textContent=`${hours.toFixed(hours%1?1:0)}h`;
  };


  R.renderDays = () => {
    const container=R.$("routeDayTabsV5");container.innerHTML="";
    for(let i=0;i<7;i++){
      const date=R.addDays(R.ui.week,i),key=R.key(date),count=R.filtered(R.weekItems().filter(x=>x.actualDate===key&&!x.cancelled)).length;
      const btn=document.createElement("button");btn.type="button";btn.className=`route-day-tab-v5 ${R.ui.selectedDay===i?"active":""} ${count?"has-clients":""}`;
      btn.innerHTML=`<span>${R.DAY_SHORT[date.getDay()]}</span><strong>${R.pad(date.getDate())}/${R.pad(date.getMonth()+1)}</strong><small>${count}</small>`;
      btn.onclick=()=>{R.ui.selectedDay=i;R.render();};container.appendChild(btn);
    }
  };

  R.status = item => {
    if(item.cancelled)return ["cancelled","Cancelado"];
    if(item.paid)return ["paid",item.paymentMethod==="cash"?"Pago em dinheiro":"Pago no cartão"];
    if(R.isOverdue(item))return ["overdue",`${R.daysLate(item.actualDate)}d atrasado`];
    return ["pending",item.client.frequency==="fortnightly"?"Quinzenal":item.client.frequency==="once"?"Somente uma vez":item.client.frequency==="extra"?"Extra":"Pendente"];
  };

  R.searchClients = () => {
    const query=R.ui.search.trim().toLowerCase();
    if(!query)return [];
    return R.clients()
      .filter(client=>client.name.toLowerCase().includes(query))
      .sort((a,b)=>
        Number(a.day)-Number(b.day) ||
        Number(a.order||1)-Number(b.order||1) ||
        a.name.localeCompare(b.name)
      );
  };

  R.renderClientSearch = () => {
    const clients=R.searchClients();
    R.$("routeSelectedDayTitleV5").textContent="Resultados da busca";
    R.$("routeSelectedDaySubtitleV5").textContent=
      `${clients.length} ${clients.length===1?"cliente cadastrado encontrado":"clientes cadastrados encontrados"}`;
    R.$("routeSelectedDayTotalV5").textContent=R.money(
      clients.reduce((sum,client)=>sum+Number(client.hourlyRate||0)*Number(client.hours||0),0)
    );

    const list=R.$("routeClientListV5");
    if(!clients.length){
      list.innerHTML='<div class="route-empty-v5"><b>Nenhum cliente encontrado</b><span>A busca consulta todos os clientes cadastrados.</span></div>';
      return;
    }

    list.innerHTML=clients.map(client=>`
      <article class="route-client-card-v5 route-search-result-v54">
        <button class="route-order-v5" type="button" data-search-edit="${client.id}">${Number(client.order||1)}º</button>
        <div class="route-client-main-v5">
          <strong>${R.escape(client.name)}</strong>
          <span>${R.DAY_NAMES[Number(client.day)]} · ${client.frequency==="fortnightly"?"Quinzenal":client.frequency==="once"?"Somente uma vez":client.frequency==="extra"?"Extra · sem data fixa":"Semanal"}</span>
          <small>${Number(client.hours||0)}h × ${R.money(Number(client.hourlyRate||0))}/h</small>
        </div>
        <div class="route-client-value-v5">
          <strong>${R.money(Number(client.hours||0)*Number(client.hourlyRate||0))}</strong>
          <button class="route-pay-button-v5" type="button" data-search-profile="${client.id}">Perfil</button>
        </div>
      </article>`).join("");

    list.querySelectorAll("[data-search-edit]").forEach(button=>{
      button.onclick=()=>R.openClient(R.client(button.dataset.searchEdit));
    });
    list.querySelectorAll("[data-search-profile]").forEach(button=>{
      button.onclick=()=>R.openProfile(R.client(button.dataset.searchProfile));
    });
  };

  R.renderSelectedDay = () => {
    const date=R.addDays(R.ui.week,R.ui.selectedDay),key=R.key(date);
    const items=R.filtered(R.weekItems().filter(x=>x.actualDate===key));
    const active=items.filter(x=>!x.cancelled);
    R.$("routeSelectedDayTitleV5").textContent=R.DAY_NAMES[date.getDay()];
    R.$("routeSelectedDaySubtitleV5").textContent=`${items.length} ${items.length===1?"cliente programado":"clientes programados"}`;
    R.$("routeSelectedDayTotalV5").textContent=R.money(active.reduce((s,x)=>s+x.amount,0));
    const list=R.$("routeClientListV5");
    if(!items.length){
      list.innerHTML='<div class="route-empty-v5"><b>Nenhum cliente nesta categoria</b><span>Selecione outro dia ou outro filtro.</span></div>';
      return;
    }
    list.innerHTML=items.map(item=>{
      const [tone,label]=R.status(item);
      return `<article class="route-client-card-v5 ${tone}">
        <button class="route-order-v5" type="button" data-manage="${item.key}">${item.order}º</button>
        <div class="route-client-main-v5">
          <strong>${R.escape(item.client.name)}</strong>
          <span>${item.client.startTime?`${item.client.startTime} · `:""}${item.hours}h × ${R.money(item.hourlyRate)}/h${item.client.postcode?` · ${R.escape(item.client.postcode)}`:""}</span>
          <small>${label}</small>
        </div>
        <div class="route-client-value-v5">
          <strong>${R.money(item.amount)}</strong>
          <button class="route-pay-button-v5 ${item.paid?"confirmed":""}" type="button" data-pay="${item.key}" ${item.cancelled?"disabled":""}>${item.cancelled?"—":item.paid?"Pago":"Pagar"}</button>
        </div>
      </article>`;
    }).join("");
    list.querySelectorAll("[data-pay]").forEach(btn=>btn.onclick=()=>R.openPayment(R.fromKey(btn.dataset.pay)));
    list.querySelectorAll("[data-manage]").forEach(btn=>btn.onclick=()=>R.openManage(R.fromKey(btn.dataset.manage)));
  };

  R.openManage = item => {
    R.$("routeManageKeyV5").value=item.key;
    R.$("routeManageClientV5").textContent=`${item.client.name} · ${R.formatDate(item.actualDate)}`;
    R.$("routeCancelVisitV5").querySelector("b").textContent=item.cancelled?"Reativar limpeza":"Cancelar limpeza";
    R.$("routeMoreOptionsV53")?.classList.add("hidden");
    const moreButton=R.$("routeShowMoreV53");
    if(moreButton){
      moreButton.querySelector("b").textContent="Mostrar mais";
      moreButton.querySelector("small").textContent="Outras opções";
    }
    R.$("routeManageDialogV5").showModal();
  };

  R.openQuick = (type,item) => {
    const map={
      date:["Alterar data","Escolha a nova data","date",item.actualDate],
      hours:["Alterar horas","Informe a nova duração","number",item.hours],
      rate:["Alterar valor/hora","Informe o novo valor","number",item.hourlyRate],
      order:["Alterar sequência","Informe a nova posição","number",item.order]
    };
    const [title,subtitle,inputType,value]=map[type];
    R.$("routeQuickEditKeyV5").value=item.key;
    R.$("routeQuickEditTypeV5").value=type;
    R.$("routeQuickEditTitleV5").textContent=title;
    R.$("routeQuickEditSubtitleV5").textContent=`${item.client.name} · ${subtitle}`;
    const input=R.$("routeQuickEditValueV5");
    input.type=inputType;
    input.step=type==="date"?"":type==="order"?"1":"0.25";
    input.value=value;

    const orderWrap=R.$("routeQuickEditOrderWrapV55");
    const orderInput=R.$("routeQuickEditOrderV55");
    orderWrap.classList.toggle("hidden",type!=="date");
    if(type==="date"){
      orderInput.value=String(item.order||"");
      input.onchange=()=>{
        const target=input.value||item.actualDate;
        orderInput.placeholder=`Automática: ${R.nextVisitOrder(target,item.key)}º`;
      };
      input.onchange();
    }else{
      input.onchange=null;
      orderInput.value="";
    }

    R.feedback("routeQuickEditFeedbackV5","");
    R.$("routeQuickEditDialogV5").showModal();
  };

  R.saveQuick = async () => {
    const item=R.fromKey(R.$("routeQuickEditKeyV5").value);
    const type=R.$("routeQuickEditTypeV5").value;
    const value=R.$("routeQuickEditValueV5").value;
    if(!item)return;

    const updates={};
    if(type==="date"){
      const newDate=value||item.actualDate;
      const sequenceText=R.$("routeQuickEditOrderV55").value.trim();
      const sequence=sequenceText
        ? Number(sequenceText)
        : R.nextVisitOrder(newDate,item.key);

      if(!Number.isInteger(sequence)||sequence<1){
        return R.feedback("routeQuickEditFeedbackV5","Digite uma sequência válida ou deixe vazio.");
      }

      // Abre espaço na nova data para a posição escolhida.
      const targetWeek=R.weekStart(R.date(newDate));
      R.instances(targetWeek,R.addDays(targetWeek,6))
        .filter(other=>
          other.actualDate===newDate &&
          other.key!==item.key &&
          !other.cancelled &&
          Number(other.order||0)>=sequence
        )
        .forEach(other=>R.upsertVisit(other,{order:Number(other.order||0)+1}));

      updates.actualDate=newDate;
      updates.order=sequence;
    }
    if(type==="hours")updates.hours=Math.max(.25,Number(value||0));
    if(type==="rate")updates.hourlyRate=Math.max(0,Number(value||0));
    if(type==="order"){
      const sequence=Math.max(1,Number(value||0));
      if(!Number.isInteger(sequence)){
        return R.feedback("routeQuickEditFeedbackV5","Digite uma sequência válida.");
      }
      updates.order=sequence;
    }

    R.upsertVisit(item,updates);
    R.$("routeQuickEditDialogV5").close();
    R.$("routeManageDialogV5").close();
    await persist(type==="date"?"Data e sequência alteradas":"Limpeza alterada");
  };

  R.toggleCancel = async () => {
    const item=R.fromKey(R.$("routeManageKeyV5").value);
    if(!item||item.paid)return alert("Desmarque o pagamento antes de cancelar.");
    R.upsertVisit(item,{cancelled:!item.cancelled});
    R.$("routeManageDialogV5").close();
    await persist(item.cancelled?"Limpeza reativada":"Limpeza cancelada");
  };

  R.restore = async () => {
    const item=R.fromKey(R.$("routeManageKeyV5").value);
    if(!item||item.paid)return alert("Desmarque o pagamento antes de restaurar.");
    R.restoreVisit(item);R.$("routeManageDialogV5").close();await persist("Limpeza restaurada");
  };

  R.openProfile = client => {
    const visits=R.clientHistory(client.id),now=new Date(),month=now.getMonth(),year=now.getFullYear();
    const paid=visits.filter(x=>x.paid),monthPaid=paid.filter(x=>R.date(x.paymentDate||x.actualDate).getMonth()===month&&R.date(x.paymentDate||x.actualDate).getFullYear()===year);
    const yearPaid=paid.filter(x=>R.date(x.paymentDate||x.actualDate).getFullYear()===year);
    R.$("routeProfileNameV5").textContent=client.name;
    R.$("routeProfileScheduleV5").textContent=`${R.DAY_NAMES[Number(client.day)]} · ${client.frequency==="fortnightly"?"quinzenal":client.frequency==="once"?"somente uma vez":client.frequency==="extra"?"extra · sem data fixa":"semanal"} · ${client.hours}h`;
    R.$("routeProfileMonthV5").textContent=R.money(monthPaid.reduce((s,x)=>s+x.amountReceived,0));
    R.$("routeProfileYearV5").textContent=R.money(yearPaid.reduce((s,x)=>s+x.amountReceived,0));
    R.$("routeProfileHoursV5").textContent=`${paid.reduce((s,x)=>s+x.hours,0).toFixed(1)}h`;
    R.$("routeProfileProfitV5").textContent=R.money(paid.reduce((s,x)=>s+(x.amountReceived-x.estimatedCost),0));
    R.$("routeProfileCancellationsV5").textContent=String(visits.filter(x=>x.cancelled).length);
    R.$("routeProfilePaidVisitsV5").textContent=String(paid.length);
    R.$("routeProfileHistoryV5").innerHTML=visits.length?visits.map(x=>`
      <article class="route-profile-history-item-v5 ${x.cancelled?"cancelled":x.paid?"paid":"pending"}">
        <div><strong>${R.formatDate(x.actualDate)}</strong><small>${x.hours}h · ${R.money(x.hourlyRate)}/h</small></div>
        <div><b>${x.cancelled?"Cancelado":x.paid?R.money(x.amountReceived):R.money(x.amount)}</b><small>${x.paid?(x.paymentMethod==="cash"?"Dinheiro":"Cartão"):"Pendente"}</small></div>
      </article>`).join(""):'<div class="route-empty-v5"><b>Sem histórico</b></div>';
    R.$("routeClientProfileDialogV5").showModal();
  };
})();


/* ----- route.js ----- */
(() => {
  "use strict";
  const R=window.RouteV5;


  R.calendarV59={month:new Date(new Date().getFullYear(),new Date().getMonth(),1,12),selectedDate:R.today(),multiMonth:new Date(new Date().getFullYear(),new Date().getMonth(),1,12),selectedKeys:new Set()};
  R.monthCellsV59=month=>{const f=new Date(month.getFullYear(),month.getMonth(),1,12),l=new Date(month.getFullYear(),month.getMonth()+1,0,12),cells=[];for(let i=0;i<(f.getDay()+6)%7;i++)cells.push(null);for(let d=1;d<=l.getDate();d++)cells.push(new Date(month.getFullYear(),month.getMonth(),d,12));while(cells.length%7)cells.push(null);return cells};
  R.openCalendarV59=()=>{const n=new Date();R.calendarV59.month=new Date(n.getFullYear(),n.getMonth(),1,12);R.calendarV59.selectedDate=R.today();R.renderCalendarV59();R.$("routeCalendarDialogV59").showModal()};
  R.renderCalendarV59=()=>{const m=R.calendarV59.month,s=new Date(m.getFullYear(),m.getMonth(),1,12),e=new Date(m.getFullYear(),m.getMonth()+1,0,12),items=R.instances(s,e);R.$("routeCalendarMonthLabelV59").textContent=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(m);const g=R.$("routeCalendarGridV59");g.innerHTML=R.monthCellsV59(m).map(d=>{if(!d)return '<span></span>';const k=R.key(d),its=items.filter(x=>x.actualDate===k),c=['route-calendar-day-v59',k===R.today()?'today':'',k===R.calendarV59.selectedDate?'selected':'',its.length?'has-clients':''].filter(Boolean).join(' ');return `<button type="button" class="${c}" data-calendar-date="${k}"><span>${d.getDate()}</span>${its.length?`<small>${its.length}</small>`:''}</button>`}).join('');g.querySelectorAll('[data-calendar-date]').forEach(b=>b.onclick=()=>{R.calendarV59.selectedDate=b.dataset.calendarDate;R.renderCalendarV59()});R.renderCalendarDayClientsV59()};
  R.renderCalendarDayClientsV59=()=>{const k=R.calendarV59.selectedDate,d=R.date(k),w=R.weekStart(d),items=R.instances(w,R.addDays(w,6)).filter(x=>x.actualDate===k).sort((a,b)=>a.order-b.order);R.$("routeCalendarDayLabelV59").textContent=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long"}).format(d);R.$("routeCalendarDayTotalV59").textContent=R.money(items.filter(x=>!x.cancelled).reduce((s,x)=>s+x.amount,0));const l=R.$("routeCalendarClientsV59");l.innerHTML=items.length?items.map(x=>`<button type="button" class="route-calendar-client-v59 ${x.cancelled?'cancelled':x.paid?'paid':R.isOverdue(x)?'overdue':''}" data-calendar-client="${x.key}"><span>${x.order}º</span><div><strong>${R.escape(x.client.name)}${x.client.frequency==='extra'?' <i class="route-extra-inline-v510">EXTRA</i>':''}</strong><small>${x.hours}h · ${R.money(x.amount)}</small></div><em>${x.cancelled?'Cancelado':x.paid?'Pago':'Abrir'}</em></button>`).join(''):'<div class="route-empty-v5"><b>Nenhum cliente neste dia</b></div>';l.querySelectorAll('[data-calendar-client]').forEach(b=>b.onclick=()=>{const x=R.fromKey(b.dataset.calendarClient);R.$("routeCancelVisitKeyV59").value=x.key;R.$("routeCancelClientLabelV59").textContent=`${x.client.name} · ${R.formatDate(x.actualDate)}`;R.$("routeCancelModeDialogV59").showModal()})};
  R.cancelSingleV59=async()=>{const x=R.fromKey(R.$("routeCancelVisitKeyV59").value);if(!x)return;if(x.paid)return alert("Desmarque o pagamento antes de cancelar.");R.upsertVisit(x,{cancelled:true});R.$("routeCancelModeDialogV59").close();await persist("Limpeza cancelada");R.renderCalendarV59()};
  R.openMultiCancelV59=()=>{const x=R.fromKey(R.$("routeCancelVisitKeyV59").value);if(!x)return;R.$("routeCancelModeDialogV59").close();R.$("routeMultiCancelClientIdV59").value=x.clientId;R.$("routeMultiCancelClientV59").textContent=x.client.name;const d=R.date(x.actualDate);R.calendarV59.multiMonth=new Date(d.getFullYear(),d.getMonth(),1,12);R.calendarV59.selectedKeys=new Set();R.renderMultiCancelV59();R.$("routeMultiCancelDialogV59").showModal()};
  R.clientScheduledDatesInMonthV59=(c,m)=>{const s=new Date(m.getFullYear(),m.getMonth(),1,12),e=new Date(m.getFullYear(),m.getMonth()+1,0,12),a=[];for(let d=new Date(s);d<=e;d=R.addDays(d,1))if(R.isScheduled(c,d))a.push(R.key(d));return [...new Set(a)]};
  R.renderMultiCancelV59=()=>{const c=R.client(R.$("routeMultiCancelClientIdV59").value),m=R.calendarV59.multiMonth;if(!c)return;const sched=new Set(R.clientScheduledDatesInMonthV59(c,m));R.$("routeMultiCancelMonthV59").textContent=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(m);const g=R.$("routeMultiCancelGridV59");g.innerHTML=R.monthCellsV59(m).map(d=>{if(!d)return '<span></span>';const k=R.key(d),on=sched.has(k),sel=R.calendarV59.selectedKeys.has(k);return `<button type="button" class="route-calendar-day-v59 multi ${on?'scheduled':''} ${sel?'selected-cancel':''}" data-multi-date="${k}" ${on?'':'disabled'}><span>${d.getDate()}</span></button>`}).join('');g.querySelectorAll('[data-multi-date]').forEach(b=>b.onclick=()=>{const k=b.dataset.multiDate;R.calendarV59.selectedKeys.has(k)?R.calendarV59.selectedKeys.delete(k):R.calendarV59.selectedKeys.add(k);R.renderMultiCancelV59()});const n=R.calendarV59.selectedKeys.size;R.$("routeMultiCancelCountV59").textContent=`${n} ${n===1?'dia selecionado':'dias selecionados'}`};
  R.saveMultiCancelV59=async()=>{const c=R.client(R.$("routeMultiCancelClientIdV59").value),keys=[...R.calendarV59.selectedKeys];if(!c||!keys.length)return alert("Selecione pelo menos um dia.");for(const k of keys){const x=R.instance(c,k);if(!x.paid)R.upsertVisit(x,{actualDate:k,cancelled:true})}R.$("routeMultiCancelDialogV59").close();await persist(`${keys.length} limpezas canceladas`);R.renderCalendarV59()};

  R.openClientDirectoryV510 = () => { R.$("routeClientListSearchV510").value=""; R.renderClientDirectoryV510(); R.$("routeClientListDialogV510").showModal(); };
  R.renderClientDirectoryV510 = () => {
    const q=(R.$("routeClientListSearchV510")?.value||"").trim().toLowerCase();
    const clients=R.clients().filter(c=>!q||c.name.toLowerCase().includes(q)).sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
    const box=R.$("routeClientDirectoryV510");
    box.innerHTML=clients.length?clients.map(c=>`<article class="route-directory-client-v510"><div class="route-directory-badge-v510 ${c.frequency==='extra'?'extra':''}">${c.frequency==='extra'?'EX':'▦'}</div><div><strong>${R.escape(c.name)}</strong><small>${c.frequency==='extra'?'Extra · sem data fixa':`${R.DAY_NAMES[Number(c.day)]} · ${c.frequency==='fortnightly'?'Quinzenal':c.frequency==='once'?'Somente uma vez':'Semanal'}`}</small></div><div class="route-directory-actions-v510"><button data-directory-profile="${c.id}" type="button">Perfil</button><button data-directory-edit="${c.id}" type="button">Editar</button><button data-directory-delete="${c.id}" class="danger" type="button">Excluir</button></div></article>`).join(''):'<div class="route-empty-v5"><b>Nenhum cliente encontrado</b></div>';
    box.querySelectorAll('[data-directory-profile]').forEach(b=>b.onclick=()=>R.openProfile(R.client(b.dataset.directoryProfile)));
    box.querySelectorAll('[data-directory-edit]').forEach(b=>b.onclick=()=>{R.$("routeClientListDialogV510").close();R.openClient(R.client(b.dataset.directoryEdit))});
    box.querySelectorAll('[data-directory-delete]').forEach(b=>b.onclick=()=>{const c=R.client(b.dataset.directoryDelete);R.$("routeClientListDialogV510").close();R.openClient(c);setTimeout(()=>R.deleteClient(),80)});
  };
  R.openAddExtraV510 = () => {
    const extras=R.clients().filter(c=>c.frequency==='extra').sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
    if(!extras.length){alert('Cadastre primeiro um cliente com a frequência “Extra · sem data fixa”.');return;}
    const dateKey=R.calendarV59.selectedDate;
    R.$("routeExtraDateV510").value=dateKey;R.$("routeExtraDateLabelV510").textContent=R.formatDate(dateKey);
    R.$("routeExtraClientSelectV510").innerHTML=extras.map(c=>`<option value="${c.id}">${R.escape(c.name)}</option>`).join('');
    R.$("routeExtraOrderV510").value="";R.feedback("routeExtraFeedbackV510","");R.$("routeAddExtraDialogV510").showModal();
  };
  R.saveExtraVisitV510 = async () => {
    const client=R.client(R.$("routeExtraClientSelectV510").value),dateKey=R.$("routeExtraDateV510").value;
    if(!client||!dateKey)return;
    const exists=(R.ensure().visits||[]).some(v=>String(v.clientId)===String(client.id)&&v.actualDate===dateKey);
    if(exists)return R.feedback("routeExtraFeedbackV510","Este cliente já foi adicionado nessa data.");
    const text=R.$("routeExtraOrderV510").value.trim();const order=text?Number(text):R.nextVisitOrder(dateKey);
    if(!Number.isInteger(order)||order<1)return R.feedback("routeExtraFeedbackV510","Digite uma sequência válida ou deixe vazio.");
    const item=R.instance(client,dateKey);R.upsertVisit(item,{actualDate:dateKey,order,extra:true,cancelled:false});
    R.$("routeAddExtraDialogV510").close();await persist("Cliente extra adicionado");R.renderCalendarV59();
  };

  function bind(){
    const once=(id,event,fn)=>{
      const node=R.$(id);if(!node)return;
      const key=`route${event}`;
      if(node.dataset[key])return;
      node.dataset[key]="1";node.addEventListener(event,fn);
    };

    once("openRouteClientV5","click",()=>R.openClient());
    once("openRouteClientListV510","click",R.openClientDirectoryV510);
    once("closeRouteClientListV510","click",()=>R.$("routeClientListDialogV510").close());
    once("routeClientListSearchV510","input",R.renderClientDirectoryV510);
    once("routeClientFrequencyV5","change",R.toggleExtraClientFieldsV510);
    once("openAddExtraV510","click",R.openAddExtraV510);
    once("saveRouteExtraVisitV510","click",R.saveExtraVisitV510);
    once("openRouteCalendarV59","click",R.openCalendarV59);
    once("closeRouteCalendarV59","click",()=>R.$("routeCalendarDialogV59").close());
    once("routeCalendarPrevV59","click",()=>{R.calendarV59.month=new Date(R.calendarV59.month.getFullYear(),R.calendarV59.month.getMonth()-1,1,12);R.renderCalendarV59()});
    once("routeCalendarNextV59","click",()=>{R.calendarV59.month=new Date(R.calendarV59.month.getFullYear(),R.calendarV59.month.getMonth()+1,1,12);R.renderCalendarV59()});
    once("routeCalendarTodayV59","click",()=>{const n=new Date();R.calendarV59.month=new Date(n.getFullYear(),n.getMonth(),1,12);R.calendarV59.selectedDate=R.today();R.renderCalendarV59()});
    once("cancelSingleVisitV59","click",R.cancelSingleV59);
    once("cancelMultipleVisitsV59","click",R.openMultiCancelV59);
    once("closeRouteMultiCancelV59","click",()=>R.$("routeMultiCancelDialogV59").close());
    once("routeMultiCancelPrevV59","click",()=>{R.calendarV59.multiMonth=new Date(R.calendarV59.multiMonth.getFullYear(),R.calendarV59.multiMonth.getMonth()-1,1,12);R.renderMultiCancelV59()});
    once("routeMultiCancelNextV59","click",()=>{R.calendarV59.multiMonth=new Date(R.calendarV59.multiMonth.getFullYear(),R.calendarV59.multiMonth.getMonth()+1,1,12);R.renderMultiCancelV59()});
    once("saveRouteMultiCancelV59","click",R.saveMultiCancelV59);
    once("routePrevWeekV5","click",()=>{R.ui.week=R.addDays(R.ui.week,-7);R.render();});
    once("routeNextWeekV5","click",()=>{R.ui.week=R.addDays(R.ui.week,7);R.render();});
    once("toggleRouteOverdueV5","click",()=>{R.$("routeOverduePanelV56").classList.toggle("hidden");R.$("routeCancelledPanelV56").classList.add("hidden");});
    once("toggleRouteCancelledV56","click",()=>{R.$("routeCancelledPanelV56").classList.toggle("hidden");R.$("routeOverduePanelV56").classList.add("hidden");});
    once("closeRouteOverdueV56","click",()=>R.$("routeOverduePanelV56").classList.add("hidden"));
    once("closeRouteCancelledV56","click",()=>R.$("routeCancelledPanelV56").classList.add("hidden"));
    once("toggleRouteToolsV56","click",()=>{
      const panel=R.$("routeExtraToolsV56"),button=R.$("toggleRouteToolsV56"),opening=panel.classList.contains("hidden");
      panel.classList.toggle("hidden");
      button.querySelector("strong").textContent=opening?"Menos":"Mais";
      button.querySelector("small").textContent=opening?"Fechar":"Resumo mensal";
      button.querySelector("em").textContent=opening?"⌃":"⌄";
      if(opening)setTimeout(()=>panel.scrollIntoView({behavior:"smooth",block:"nearest"}),80);
    });

    ["routeClientRateV5","routeClientHoursV5"].forEach(id=>once(id,"input",R.previewClient));
    once("saveRouteClientV5","click",R.saveClient);
    once("duplicateRouteClientV5","click",R.duplicateClient);
    once("deleteRouteClientV5","click",R.deleteClient);
    once("saveRoutePaymentV5","click",R.savePayment);
    once("removeRoutePaymentV5","click",R.removePayment);

    once("routeChangeDateV5","click",()=>R.openQuick("date",R.fromKey(R.$("routeManageKeyV5").value)));
    once("routeChangeHoursV5","click",()=>R.openQuick("hours",R.fromKey(R.$("routeManageKeyV5").value)));
    once("routeChangeRateV5","click",()=>R.openQuick("rate",R.fromKey(R.$("routeManageKeyV5").value)));
    once("routeChangeOrderV5","click",()=>R.openQuick("order",R.fromKey(R.$("routeManageKeyV5").value)));
    once("routeShowMoreV53","click",()=>{
      const extra=R.$("routeMoreOptionsV53");
      const button=R.$("routeShowMoreV53");
      const opening=extra.classList.contains("hidden");
      extra.classList.toggle("hidden");
      button.querySelector("b").textContent=opening?"Mostrar menos":"Mostrar mais";
      button.querySelector("small").textContent=opening?"Ocultar opções":"Outras opções";
    });
    once("routeCancelVisitV5","click",R.toggleCancel);
    once("routeRestoreVisitV5","click",R.restore);
    once("routeViewClientV5","click",()=>{const x=R.fromKey(R.$("routeManageKeyV5").value);R.$("routeManageDialogV5").close();R.openProfile(x.client);});
    once("routeEditClientV5","click",()=>{const x=R.fromKey(R.$("routeManageKeyV5").value);R.$("routeManageDialogV5").close();R.openClient(x.client);});
    once("saveRouteQuickEditV5","click",R.saveQuick);
    once("closeRouteProfileV5","click",()=>R.$("routeClientProfileDialogV5").close());

    const nav=document.querySelector('.nav-item[data-view="routeView"]');
    if(nav&&!nav.dataset.routeBound){
      nav.dataset.routeBound="1";
      nav.onclick=()=>{
        R.ui.week=R.weekStart(new Date());
        R.ui.selectedDay=Math.max(0,Math.min(6,R.mondayIndex(new Date().getDay())));
        document.querySelectorAll(".app-section").forEach(x=>x.classList.remove("active-section"));
        R.$("routeView").classList.add("active-section");
        document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
        nav.classList.add("active");
        window.scrollTo({top:0,behavior:"smooth"});
        R.render();
      };
    }
  }

  const baseRender=window.render;
  if(typeof baseRender==="function"){
    window.render=function(){baseRender();R.render();};
  }

  document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{bind();R.render();},60));
  window.addEventListener("pageshow",()=>setTimeout(()=>{
    R.ui.week=R.weekStart(new Date());
    R.ui.selectedDay=Math.max(0,Math.min(6,R.mondayIndex(new Date().getDay())));
    bind();
    R.render();
  },100));
})();
