/* Nosso Controle 3.0.2 — aplicação refatorada */
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
  try{
    const {data:{session},error}=await sb.auth.getSession();
    if(error)throw error;
    if(!session){show("authView");return}
    user=session.user;await ensureProfile(user);await loadMembership();
  }catch(error){console.error("Boot:",error);show("authView");feedback("authMsg","Não foi possível restaurar a sessão. Entre novamente.")}
}
async function loadMembership(){
  const {data,error}=await sb.from("household_members").select("household_id, households(code)").eq("user_id",user.id).maybeSingle();
  if(error){toast(error.message);return}
  if(!data){show("householdView");return}
  householdId=data.household_id;householdCode=data.households.code;
  await loadState();subscribe();show("appView");
}
async function loadState(){
  const {data,error}=await sb.from("finance_state").select("data").eq("household_id",householdId).single();
  if(error){toast("Erro ao carregar");return}
  state=data.data;
  if(state.dailyGoal==null)state.dailyGoal=70;
  if(!state.displayName)state.displayName="Lucas";
  if(!Array.isArray(state.incomes))state.incomes=[];
  if(!Array.isArray(state.expenses))state.expenses=[];
  if(!Array.isArray(state.vaultEntries))state.vaultEntries=[];
  state.vaultEntries=state.vaultEntries.map(x=>({...x,location:x.location||"envelope"}));
  if(!Array.isArray(state.completedBills))state.completedBills=[];
  state.bills=state.bills.map(b=>({
    frequency:b.frequency||"monthly",
    type:b.type||"fixed",
    currentInstallment:b.currentInstallment||null,
    totalInstallments:b.totalInstallments||null,
    completed:false,
    ...b
  }));
  if(!state.bills.some(b=>b.id==="car_installment")){
    const today=new Date();
    const day=today.getDay();
    const daysToSaturday=(6-day+7)%7 || 7;
    const nextSaturday=new Date(today);
    nextSaturday.setDate(today.getDate()+daysToSaturday);
    const due=`${nextSaturday.getFullYear()}-${String(nextSaturday.getMonth()+1).padStart(2,"0")}-${String(nextSaturday.getDate()).padStart(2,"0")}`;
    state.bills.push({
      id:"car_installment",
      name:"Parcela do carro",
      amount:200,
      due,
      reserved:0,
      paid:false,
      frequency:"weekly",
      type:"installment",
      currentInstallment:9,
      totalInstallments:12,
      completed:false
    });
  }
  render();
}
async function persist(successMessage){
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
      toast(retry.error?"Não foi possível sincronizar":"Sincronizado");
    },1200);
  }else if(successMessage){
    toast(successMessage);
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
  try{
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error){
      console.warn("Login Supabase:",error.message);
      feedback("authMsg",authMessage(error));
      return;
    }
    if(!data?.session?.user){
      feedback("authMsg","O Supabase não criou a sessão. Tente novamente.");
      return;
    }

    localStorage.setItem("nosso-controle-email",email);
    user=data.session.user;
    closeKeyboardAndResetViewport(true);
    await loadMembership();
  }catch(error){
    console.error("Login:",error);
    feedback("authMsg",navigator.onLine
      ?"Não foi possível conectar ao Supabase agora. Tente novamente."
      :"Sem conexão com a internet.");
  }finally{
    setAuthLoading(false);
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
  const pending=pendingSignup();
  if(pending?.email){$("signupEmail").value=pending.email;$("signupUsername").value=pending.username||"";showResendConfirmation(true);}
  try{$("signupDialog").showModal()}catch{$("signupDialog").setAttribute("open","")}
};
$("createAccountBtn").onclick=async()=>{
  feedback("signupMsg","");
  showResendConfirmation(false);
  const username=normalizeUsername($("signupUsername").value);
  const email=$("signupEmail").value.trim().toLowerCase();
  const password=$("signupPassword").value;
  const confirm=$("signupPasswordConfirm").value;
  if(username.length<3)return feedback("signupMsg","Use um Username com pelo menos 3 caracteres.");
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
      options:{
        data:{username},
        emailRedirectTo:`${location.origin}${location.pathname}`
      }
    });

    if(error){
      const msg=String(error.message||"").toLowerCase();
      if(msg.includes("already registered")||msg.includes("already been registered")){
        feedback("signupMsg","Este e-mail já possui uma conta. Entre com a senha antiga ou toque em Esqueci minha senha.");
      }else{
        feedback("signupMsg",error.message);
      }
      return;
    }

    const identities=data?.user?.identities||[];
    if(data?.user && identities.length===0){
      feedback("signupMsg","Este e-mail já possui uma conta. Não foi criada uma nova. Use Entrar ou Recuperar senha.");
      $("email").value=email;
      localStorage.setItem("nosso-controle-email",email);
      return;
    }

    rememberIdentity(username,email);

    if(data?.session?.user){
      user=data.session.user;
      await ensureProfile(user,username);
      clearPendingSignup();
      feedback("signupMsg","Conta criada. Entrando…");
      try{$("signupDialog").close()}catch{}
      await loadMembership();
      return;
    }

    savePendingSignup(username,email);
    $("email").value=email;
    feedback("signupMsg","Conta criada. Abra o e-mail de confirmação enviado pelo Supabase. Depois volte e faça o primeiro acesso usando o e-mail completo.");
    showResendConfirmation(true);
  }catch(error){
    feedback("signupMsg",navigator.onLine?(error?.message||"Não foi possível criar a conta."):"Sem conexão com a internet.");
  }finally{
    button.disabled=false;
    button.textContent="Criar minha conta";
  }
};

$("resendConfirmationBtn").onclick=async()=>{
  const pending=pendingSignup();
  const email=$("signupEmail").value.trim().toLowerCase()||pending?.email||"";
  if(!email.includes("@"))return feedback("signupMsg","Digite o e-mail usado no cadastro.");
  const button=$("resendConfirmationBtn");
  button.disabled=true;
  button.textContent="Reenviando…";
  try{
    const {error}=await sb.auth.resend({
      type:"signup",
      email,
      options:{emailRedirectTo:`${location.origin}${location.pathname}`}
    });
    feedback("signupMsg",error?error.message:"E-mail de confirmação reenviado. Verifique também Spam e Lixo eletrônico.");
  }catch(error){
    feedback("signupMsg",error?.message||"Não foi possível reenviar agora.");
  }finally{
    button.disabled=false;
    button.textContent="Reenviar e-mail de confirmação";
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
  $("incomeList").innerHTML=list.length?list.map(x=>`<article class="income-item">
    <div class="income-icon">💷</div>
    <div class="income-info"><b>${x.description||"Receita"}</b><small>${x.person==="lucas"?"Lucas":x.person==="namorada"?"Namorada":"Casal"} · ${new Date(x.date+"T12:00:00").toLocaleDateString("pt-BR")}</small></div>
    <div class="income-value"><strong>+${money(x.amount)}</strong><div class="row-actions"><button data-income-edit="${x.id}">Editar</button><button data-income-delete="${x.id}">Excluir</button></div></div>
  </article>`).join(""):'<div class="empty-state">Nenhuma receita registrada ainda.</div>';
  document.querySelectorAll("[data-income-edit]").forEach(button=>button.onclick=()=>editIncome(button.dataset.incomeEdit));
  document.querySelectorAll("[data-income-delete]").forEach(button=>button.onclick=()=>deleteIncome(button.dataset.incomeDelete));
}
function editIncome(id){
  const item=state.incomes.find(x=>x.id===id);
  if(!item)return;
  $("incomeEditId").value=id;
  $("incomeDialogTitle").textContent="Editar receita";
  $("incomeAmount").value=item.amount;
  $("incomeDescription").value=item.description||"";
  $("incomePerson").value=item.person||"casal";
  $("incomeDate").value=item.date;
  $("incomeDialog").showModal();
}
async function deleteIncome(id){
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
function renderVault(){
  if(!state)return;
  state.vaultEntries=Array.isArray(state.vaultEntries)?state.vaultEntries:[];
  const balance=state.vaultEntries.reduce((s,x)=>s+Number(x.amount||0),0);
  $("vaultBalance").textContent=money(balance);
  const now=new Date(),year=now.getFullYear(),month=now.getMonth();
  const monthItems=state.vaultEntries.filter(x=>{
    const d=new Date(`${x.date}T12:00:00`);
    return d.getFullYear()===year&&d.getMonth()===month;
  });
  $("vaultMonthTotal").textContent=money(monthItems.reduce((s,x)=>s+Number(x.amount||0),0));
  $("vaultEntryCount").textContent=String(state.vaultEntries.length);
  const list=[...state.vaultEntries].sort((a,b)=>new Date(b.date)-new Date(a.date));
  $("vaultList").innerHTML=list.length?list.map(x=>`<article class="vault-item">
    <div class="vault-item-icon">💎</div>
    <div class="vault-item-info"><b>${x.description||"Valor guardado"}</b><small>${new Date(x.date+"T12:00:00").toLocaleDateString("pt-BR")}</small><span class="vault-location-badge">${(x.location||"envelope")==="card"?"▰ Cartão":"£ Envelope"}</span></div>
    <div class="vault-item-value"><strong>+${money(x.amount)}</strong><div class="row-actions"><button data-vault-edit="${x.id}">Editar</button><button data-vault-delete="${x.id}">Excluir</button></div></div>
  </article>`).join(""):'<div class="empty-state">O cofre ainda está vazio.</div>';
  document.querySelectorAll("[data-vault-edit]").forEach(b=>b.onclick=()=>editVaultEntry(b.dataset.vaultEdit));
  document.querySelectorAll("[data-vault-delete]").forEach(b=>b.onclick=()=>deleteVaultEntry(b.dataset.vaultDelete));
}
function editVaultEntry(id){
  const item=state.vaultEntries.find(x=>x.id===id);
  if(!item)return;
  $("vaultEditId").value=id;
  $("vaultDialogTitle").textContent="Editar valor do cofre";
  $("vaultAmount").value=item.amount;
  $("vaultDescription").value=item.description||"";
  $("vaultLocation").value=item.location||"envelope";
  $("vaultDate").value=item.date;
  $("vaultDialog").showModal();
}
async function deleteVaultEntry(id){
  if(!confirm("Excluir este valor do cofre?"))return;
  state.vaultEntries=state.vaultEntries.filter(x=>x.id!==id);
  await persist("Movimentação excluída");
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


$("openNewBill").onclick=()=>openBillCreateDialog();
$("newBillType").onchange=()=>{$("installmentFields").classList.toggle("hidden",$("newBillType").value!=="installment")};
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

function localDateKey(value){
  const d=new Date(value);
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function depositTotalsByDay(){
  const totals={};
  for(const item of (state.history||[])){
    const amount=(Number(item.cash)||0)+(Number(item.card)||0);
    if(amount<=0||!item.date)continue;
    const key=localDateKey(item.date);
    totals[key]=(totals[key]||0)+amount;
  }
  return totals;
}
function renderCalendar(){
  if(!state)return;
  const year=calendarDate.getFullYear(),month=calendarDate.getMonth();
  const first=new Date(year,month,1),last=new Date(year,month+1,0);
  const totals=depositTotalsByDay(),goal=Number(state.dailyGoal||70);
  const monthLabel=new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(first);
  $("calendarMonthLabel").textContent=monthLabel;
  let monthTotal=0,goalDays=0;
  const grid=$("calendarGrid");grid.innerHTML="";
  for(let i=0;i<first.getDay();i++){
    const blank=document.createElement("div");blank.className="calendar-day blank";grid.appendChild(blank);
  }
  const todayKey=localDateKey(new Date());
  for(let day=1;day<=last.getDate();day++){
    const key=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const amount=totals[key]||0;monthTotal+=amount;
    const met=amount>=goal;if(met)goalDays++;
    const cell=document.createElement("div");
    cell.className=`calendar-day${amount>0?(met?" goal":" partial"):""}${key===todayKey?" today":""}`;
    cell.innerHTML=`<span class="calendar-day-number">${day}</span>
      ${met?'<span class="calendar-goal-check">✓</span>':""}
      <span class="calendar-day-amount">${amount>0?money(amount):"--"}</span>`;
    cell.title=amount>0?`${money(amount)} depositados`:"Nenhum depósito";
    cell.onclick=()=>showDayDetails(key);
    grid.appendChild(cell);
  }
  $("calendarMonthTotal").textContent=money(monthTotal);
  $("calendarGoalDays").textContent=String(goalDays);
}
function openCalendar(){
  $("settingsSheet").classList.add("hidden");
  calendarDate=new Date();
  renderCalendar();
  $("calendarDialog").showModal();
}

function animateMoney(id,to){
  const el=$(id),from=Number(el.dataset.money||0),start=performance.now(),duration=500;
  function frame(now){const p=Math.min(1,(now-start)/duration),v=from+(to-from)*(1-Math.pow(1-p,3));el.textContent=money(v);if(p<1)requestAnimationFrame(frame);else el.dataset.money=to}
  requestAnimationFrame(frame);
}
function allocate(value,id){
  let left=value;
  const list=id==="auto"?state.bills.filter(b=>!b.paid).sort((a,b)=>new Date(a.due)-new Date(b.due)):[state.bills.find(b=>b.id===id)];
  for(const b of list){if(!b||left<=0)break;const use=Math.min(left,Math.max(0,b.amount-b.reserved));b.reserved+=use;left-=use}
}
$("openDeposit").onclick=()=>$("depositDialog").showModal();
$("saveDeposit").onclick=async e=>{
  e.preventDefault();
  const cash=Number($("cashInput").value)||0,card=Number($("cardInput").value)||0;
  if(cash+card<=0)return toast("Digite um valor.");
  state.cash+=cash;state.card+=card;
  const id=$("billSelect").value;allocate(cash+card,id);
  const bill=id==="auto"?"Distribuição automática":state.bills.find(b=>b.id===id)?.name;
  state.history=state.history||[];
  state.history.push({date:new Date().toISOString(),text:"Depósito adicionado",cash,card,bill});
  $("cashInput").value="";$("cardInput").value="";$("depositDialog").close();
  await persist("Depósito salvo e sincronizado");
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
  $("billCreateDialog").showModal();
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
  $("vaultDialogTitle").textContent="Adicionar ao cofre";
  $("vaultAmount").value="";
  $("vaultDescription").value="";
  $("vaultLocation").value="envelope";
  $("vaultDate").value=currentLocalDate();
  $("vaultDialog").showModal();
};
$("saveVaultDeposit").onclick=async e=>{
  e.preventDefault();
  const amount=Number($("vaultAmount").value)||0;
  if(amount<=0)return toast("Digite um valor válido");
  state.vaultEntries=Array.isArray(state.vaultEntries)?state.vaultEntries:[];
  const editId=$("vaultEditId").value;
  const payload={
    amount,
    description:$("vaultDescription").value.trim(),
    location:$("vaultLocation").value,
    date:$("vaultDate").value||currentLocalDate()
  };
  if(editId){
    const item=state.vaultEntries.find(x=>x.id===editId);
    if(item)Object.assign(item,payload);
  }else{
    state.vaultEntries.push({id:crypto.randomUUID(),...payload});
  }
  $("vaultDialog").close();
  await persist(editId?"Cofre atualizado":"Valor guardado no cofre");
};


const APP_VERSION="3.0.2";
const RELEASE_NOTES=[
  {version:"3.0.2",date:"05/08/2026",title:"Refatoração de estabilidade",changes:[
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
  $("v22Income").onclick=()=>$("openIncome")?.click();$("v22Stats").onclick=()=>{renderInsights?.();safeOpen($("insightsDialog"))};$("v22Cleaning").onclick=()=>openCleaningDialog();
}
function escapeText(value){const div=document.createElement('div');div.textContent=String(value??'');return div.innerHTML}

let activeBillFilter="all";
function renderCleanBills(){
  const list=$("billList");if(!list||!state)return;
  const bills=(state.bills||[]).filter(x=>!x.completed).slice().sort((a,b)=>new Date(a.due)-new Date(b.due));
  list.innerHTML="";
  bills.forEach(b=>{const remain=Math.max(0,Number(b.amount)-Number(b.reserved)),pct=b.amount?Math.min(100,b.reserved/b.amount*100):100,days=daysSafe(b.due);const card=document.createElement('article');card.className='v21-bill-card';card.dataset.days=days;card.dataset.ready=String(remain===0);card.innerHTML=`<div class="v21-bill-top"><span class="v21-bill-icon">${billEmoji(b.name)}</span><div><strong>${escapeText(b.name)}</strong><small>${formatDate(b.due)} · ${frequencyLabel(b.frequency)}</small></div><em class="${days<0?'danger':days<=7?'warning':''}">${days<0?`${Math.abs(days)}d atrasada`:days===0?'Hoje':`${days}d`}</em></div><div class="v21-bill-progress"><i style="width:${pct}%"></i></div><div class="v21-bill-bottom"><div><strong>${money(b.reserved)} <span>/ ${money(b.amount)}</span></strong><small>${remain?`${money(remain)} restantes`:'Totalmente reservada'}</small></div><div class="v21-bill-actions"><button data-edit>✎</button><button data-pay>✓</button></div></div>${b.type==='installment'?`<div class="v21-installment"><span>Parcela ${b.currentInstallment}/${b.totalInstallments}</span><i><b style="width:${Math.min(100,b.currentInstallment/b.totalInstallments*100)}%"></b></i></div>`:''}`;q('[data-edit]',card).onclick=()=>openBillCreateDialog(b.id);q('[data-pay]',card).onclick=()=>togglePaid(b.id);list.appendChild(card)});
  renderBillHeader(bills);applyBillFilter();updateWalletSummary();
}
function renderBillHeader(bills){const list=$("billList");let summary=$("v22BillSummary");if(!summary){summary=document.createElement('section');summary.id='v22BillSummary';summary.className='v21-bill-summary';list.before(summary)}const total=bills.reduce((s,b)=>s+Number(b.amount),0),reserved=bills.reduce((s,b)=>s+Number(b.reserved),0),pct=total?Math.min(100,reserved/total*100):0;summary.innerHTML=`<div><small>BILLS ATIVAS</small><strong>${bills.length} contas</strong><span>${money(total)} no total</span></div><div class="v21-summary-track"><i style="width:${pct}%"></i></div><b>${pct.toFixed(0)}% reservado</b>`;let filters=$("v22BillFilters");if(!filters){filters=document.createElement('div');filters.id='v22BillFilters';filters.className='v21-filters';filters.innerHTML='<button data-f="all">Todas</button><button data-f="late">Atrasadas</button><button data-f="week">7 dias</button><button data-f="ready">Reservadas</button>';summary.after(filters);filters.onclick=e=>{const btn=e.target.closest('button');if(!btn)return;activeBillFilter=btn.dataset.f;applyBillFilter()}}qa('button',filters).forEach(x=>x.classList.toggle('active',x.dataset.f===activeBillFilter))}
function applyBillFilter(){qa('.v21-bill-card').forEach(card=>{const days=Number(card.dataset.days),ready=card.dataset.ready==='true';let show=true;if(activeBillFilter==='late')show=days<0;if(activeBillFilter==='week')show=days>=0&&days<=7;if(activeBillFilter==='ready')show=ready;card.hidden=!show});const f=$("v22BillFilters");if(f)qa('button',f).forEach(x=>x.classList.toggle('active',x.dataset.f===activeBillFilter))}
function updateWalletSummary(){if($("quickCashTotal"))$("quickCashTotal").textContent=money(state.cash||0);if($("quickCardTotal"))$("quickCardTotal").textContent=money(state.card||0);if($("quickSavedTotal"))$("quickSavedTotal").textContent=money(Number(state.cash||0)+Number(state.card||0))}

function ensureCleaningDialog(){if($("v22CleaningDialog"))return;const d=document.createElement('dialog');d.id='v22CleaningDialog';d.innerHTML=`<form method="dialog" class="dialog-card"><input id="v22CleaningId" type="hidden"><div class="dialog-heading"><div><h2>Registrar limpeza</h2><p>Pagamento diário no dia correto.</p></div><button value="cancel" class="round-button">×</button></div><label>Cliente ou casa<input id="v22CleaningClient" type="text"></label><label>Valor recebido<input id="v22CleaningAmount" type="number" inputmode="decimal" step="0.01"></label><label>Data opcional<input id="v22CleaningDate" type="date"></label><label>Observação<input id="v22CleaningNotes" type="text"></label><button id="v22SaveCleaning" value="cancel" class="primary-button">Salvar pagamento</button></form>`;document.body.appendChild(d);$("v22SaveCleaning").onclick=saveCleaning}
function openCleaningDialog(id=''){ensureCleaningDialog();const item=id?(state.incomes||[]).find(x=>x.id===id):null;$("v22CleaningId").value=item?.id||'';$("v22CleaningClient").value=item?.client||item?.description||'';$("v22CleaningAmount").value=item?.amount||'';$("v22CleaningDate").value=item?.date||'';$("v22CleaningNotes").value=item?.notes||'';safeOpen($("v22CleaningDialog"))}
async function saveCleaning(e){e.preventDefault();const client=$("v22CleaningClient").value.trim(),amount=Number($("v22CleaningAmount").value)||0;if(!client)return toast('Informe o cliente');if(amount<=0)return toast('Digite um valor válido');const id=$("v22CleaningId").value,payload={amount,description:client,client,date:$("v22CleaningDate").value||currentLocalDate(),notes:$("v22CleaningNotes").value.trim(),source:'cleaning',category:'limpeza'};state.incomes=state.incomes||[];if(id){const item=state.incomes.find(x=>x.id===id);if(item)Object.assign(item,payload)}else state.incomes.push({id:crypto.randomUUID(),createdAt:new Date().toISOString(),...payload});safeClose($("v22CleaningDialog"));await persist(id?'Limpeza atualizada':'Limpeza registrada')}

function renderUpdatesV22(){const panel=q('#updatesDialog .updates-panel');if(!panel)return;const header=q('.updates-header',panel);qa(':scope > *',panel).forEach(x=>{if(x!==header)x.remove()});const current=RELEASE_NOTES[0];const top=document.createElement('section');top.className='v218-current-release';top.innerHTML=`<span>${current.version}</span><div><small>VERSÃO INSTALADA</small><strong>Nosso Controle ${current.version}</strong><p>${current.title}</p></div><b>Atual</b>`;panel.appendChild(top);const history=document.createElement('section');history.className='v218-release-list';history.innerHTML=RELEASE_NOTES.map((r,i)=>`<article class="${i===0?'current':''}"><header><span>Versão ${r.version}${i===0?' · Atual':''}</span><time>${r.date}</time></header><h3>${r.title}</h3><ul>${r.changes.map(c=>`<li>${escapeText(c)}</li>`).join('')}</ul></article>`).join('');panel.appendChild(history);qa('.updates-version-badge,.settings-version').forEach(x=>x.textContent=APP_VERSION)}
function prepareSettings(){const sheet=$("settingsSheet");if(!sheet)return;sheet.classList.add('v218-settings-fixed');qa('.updates-version-badge,.settings-version').forEach(x=>x.textContent=APP_VERSION)}

const baseRender=render;
render=function(){baseRender();renderCleanDashboard();renderCleanBills();renderUpdatesV22();prepareSettings()};
window.addEventListener('pageshow',()=>{const d=$("updatesDialog");if(d?.open)safeClose(d)});
ensureCleaningDialog();prepareSettings();renderUpdatesV22();
boot();
