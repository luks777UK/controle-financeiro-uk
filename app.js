
/*
  NOSSO CONTROLE 1.1.1 -- ATUALIZAÇÃO EM UM ÚNICO ARQUIVO
  Este bloco injeta automaticamente o novo layout e estilos.
  Depois dele começa a lógica normal do aplicativo.
*/
(function preparePremiumInterface(){
  const addHTML=(position,target,markup)=>{
    if(target) target.insertAdjacentHTML(position,markup);
  };

  // Dashboard premium.
  const overview=document.getElementById("overviewView");
  if(overview && !document.getElementById("premiumNetWorth")){
    addHTML("afterbegin",overview,`
      <section class="premium-hero">
        <div class="premium-hero-glow"></div>
        <div class="premium-hero-top">
          <div>
            <span class="premium-eyebrow">PATRIMÔNIO DISPONÍVEL</span>
            <strong id="premiumNetWorth">£0,00</strong>
            <p id="premiumHeroCaption">Tudo o que vocês construíram neste mês.</p>
          </div>
          <div class="premium-score"><span>Economia</span><strong id="premiumSavingsRate">0%</strong></div>
        </div>
        <div class="premium-hero-bottom">
          <div><span>Recebido</span><b id="premiumIncome">£0,00</b></div>
          <div><span>Comprometido</span><b id="premiumCommitted">£0,00</b></div>
          <div><span>Protegido</span><b id="premiumProtected">£0,00</b></div>
        </div>
      </section>
      <section class="period-summary">
        <article><span>Hoje</span><strong id="periodTodayIncome">£0,00</strong><small>ganhos</small></article>
        <article><span>Esta semana</span><strong id="periodWeekIncome">£0,00</strong><small>ganhos</small></article>
        <article><span>Este mês</span><strong id="periodMonthIncome">£0,00</strong><small>ganhos</small></article>
      </section>
    `);

    const headings=[...overview.querySelectorAll(".section-heading")];
    const incomeHeading=headings.find(x=>x.textContent.includes("Receitas do mês"));
    if(incomeHeading){
      addHTML("beforebegin",incomeHeading,`
        <section class="finance-chart-card">
          <div class="chart-card-heading">
            <div><span>EVOLUÇÃO</span><h3>Patrimônio nos últimos 6 meses</h3></div>
            <strong id="trendBadge">--</strong>
          </div>
          <div id="wealthChart" class="svg-chart"></div>
          <div id="wealthChartLabels" class="chart-labels"></div>
        </section>
        <section class="finance-chart-grid">
          <article class="finance-chart-card compact">
            <div class="chart-card-heading"><div><span>SEMANA</span><h3>Ganhos por dia</h3></div></div>
            <div id="weeklyIncomeChart" class="bar-chart"></div>
          </article>
          <article class="finance-chart-card compact">
            <div class="chart-card-heading"><div><span>DISTRIBUIÇÃO</span><h3>Destino do dinheiro</h3></div></div>
            <div class="donut-wrap">
              <div id="moneyDonut" class="money-donut"><span id="donutCenter">£0</span></div>
              <div class="donut-legend">
                <span><i class="donut-dot bills"></i>Bills <b id="donutBills">0%</b></span>
                <span><i class="donut-dot expenses"></i>Gastos <b id="donutExpenses">0%</b></span>
                <span><i class="donut-dot vault"></i>Cofre <b id="donutVault">0%</b></span>
                <span><i class="donut-dot free"></i>Livre <b id="donutFree">0%</b></span>
              </div>
            </div>
          </article>
        </section>
      `);
    }
  }

  // Menu Atualizações.
  const adminButton=document.getElementById("openAdminPanel");
  if(adminButton && !document.getElementById("openUpdatesPanel")){
    addHTML("beforebegin",adminButton,`
      <button id="openUpdatesPanel" class="sheet-action updates-action">
        <span class="sheet-action-icon">↻</span>
        <span><b>Atualizações</b><small>Versão instalada e novidades</small></span>
        <span class="updates-version-badge">1.1.2</span>
      </button>
    `);
  }

  // Resumo detalhado do calendário.
  const calendarDialog=document.getElementById("calendarDialog");
  if(calendarDialog && !document.getElementById("dayDetailsDialog")){
    addHTML("beforebegin",calendarDialog,`
      <dialog id="dayDetailsDialog">
        <section class="day-details-panel">
          <div class="calendar-top">
            <div>
              <span class="calendar-overline">RESUMO DO DIA</span>
              <h2 id="dayDetailsTitle">Dia</h2>
              <p id="dayDetailsSubtitle">Movimentações financeiras.</p>
            </div>
            <button id="closeDayDetails" class="round-button" type="button">×</button>
          </div>
          <section class="day-details-summary">
            <article class="income"><span>Ganhos</span><strong id="dayDetailIncome">£0,00</strong></article>
            <article class="expense"><span>Gastos</span><strong id="dayDetailExpenses">£0,00</strong></article>
            <article class="bills"><span>Bills</span><strong id="dayDetailBills">£0,00</strong></article>
            <article class="vault"><span>Cofre</span><strong id="dayDetailVault">£0,00</strong></article>
          </section>
          <div class="day-net-card"><span>Saldo do dia</span><strong id="dayDetailNet">£0,00</strong></div>
          <div id="dayDetailsList" class="day-details-list"></div>
        </section>
      </dialog>
    `);
  }

  // Tela de histórico de versões.
  const adminDialog=document.getElementById("adminDialog");
  if(adminDialog && !document.getElementById("updatesDialog")){
    addHTML("beforebegin",adminDialog,`
      <dialog id="updatesDialog" class="updates-dialog">
        <section class="updates-panel">
          <div class="updates-header">
            <div><span class="calendar-overline">NOSSO CONTROLE</span><h2>Atualizações</h2><p>Veja o que mudou em cada versão.</p></div>
            <button id="closeUpdatesPanel" class="round-button" type="button">×</button>
          </div>
          <section class="current-version-card">
            <div class="version-orb">1.1.2</div>
            <div><span>VERSÃO INSTALADA</span><strong>Nosso Controle 2.0.1</strong><small>Build de 03/08/2026 · correção de login</small></div>
            <span class="version-status">Atual</span>
          </section>
          <section class="updates-timeline">
            <article class="update-entry latest">
              <div class="update-marker"></div><div class="update-content">
                <div class="update-entry-head"><div><span>Versão 2.0.1</span><strong>Central de atualizações</strong></div><small>03/08/2026</small></div>
                <ul><li>Nova área <b>Atualizações</b> no menu de três pontos.</li><li>Versão instalada e histórico de mudanças.</li><li>Fluxo preparado para atualização pelo iPhone.</li></ul>
              </div>
            </article>
            <article class="update-entry">
              <div class="update-marker"></div><div class="update-content">
                <div class="update-entry-head"><div><span>Versão 1.1 Premium</span><strong>Dashboard e análises</strong></div><small>03/08/2026</small></div>
                <ul><li>Dashboard premium e patrimônio disponível.</li><li>Ganhos de hoje, semana e mês.</li><li>Gráficos financeiros animados.</li><li>Calendário interativo com resumo por dia.</li><li>Categorias Casa, Carro e Saúde.</li></ul>
              </div>
            </article>
            <article class="update-entry">
              <div class="update-marker"></div><div class="update-content">
                <div class="update-entry-head"><div><span>Versão 1.0</span><strong>Base do aplicativo</strong></div><small>03/08/2026</small></div>
                <ul><li>Bills inteligentes e editáveis.</li><li>Parcela semanal do carro.</li><li>Cofre em Envelope e Cartão.</li><li>Sincronização pelo Supabase.</li></ul>
              </div>
            </article>
          </section>
          <p class="updates-footer-note">Seus dados permanecem salvos no Supabase durante as atualizações.</p>
        </section>
      </dialog>
    `);
  }

  // Categorias extras de gastos.
  const expenseCategory=document.getElementById("expenseCategory");
  if(expenseCategory){
    const extras=[["casa","Casa"],["carro","Carro"],["saude","Saúde"]];
    for(const [value,label] of extras){
      if(!expenseCategory.querySelector(`option[value="${value}"]`)){
        const option=document.createElement("option");
        option.value=value; option.textContent=label;
        expenseCategory.insertBefore(option,expenseCategory.querySelector('option[value="outros"]'));
      }
    }
  }

  // Estilos da nova versão inseridos pelo próprio app.js.
  if(!document.getElementById("premiumRuntimeStyles")){
    const style=document.createElement("style");
    style.id="premiumRuntimeStyles";
    style.textContent="\n\n/* ===== Nosso Controle 1.1 Premium ===== */\nbody{\n  background:\n    radial-gradient(circle at 18% -10%,rgba(123,82,255,.18),transparent 33%),\n    radial-gradient(circle at 92% 16%,rgba(35,199,164,.09),transparent 28%),\n    linear-gradient(180deg,#070812,#090a15 48%,#070812);\n}\n.app{max-width:760px}\n.header{position:sticky;top:0;z-index:20;margin:0 -16px 18px;padding:calc(12px + env(safe-area-inset-top)) 18px 12px;\n  background:rgba(7,8,18,.76);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);\n  border-bottom:1px solid rgba(255,255,255,.045)}\n.header h1{font-size:25px;letter-spacing:-.6px}\n\n.premium-hero{position:relative;overflow:hidden;padding:23px;border-radius:31px;background:\n  linear-gradient(145deg,rgba(97,59,210,.98),rgba(38,28,88,.98) 60%,rgba(19,70,70,.94));\n  border:1px solid rgba(177,151,255,.28);box-shadow:0 28px 70px rgba(43,24,104,.38)}\n.premium-hero-glow{position:absolute;width:270px;height:270px;border-radius:50%;right:-105px;top:-140px;\n  background:radial-gradient(circle,rgba(255,255,255,.24),transparent 66%)}\n.premium-hero-top,.premium-hero-bottom{position:relative;z-index:1}\n.premium-hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}\n.premium-eyebrow{font-size:9px;letter-spacing:1.35px;font-weight:850;color:rgba(255,255,255,.66)}\n.premium-hero-top>div:first-child>strong{display:block;font-size:45px;margin-top:8px;letter-spacing:-1.5px}\n.premium-hero-top p{font-size:11px;color:rgba(255,255,255,.68);margin:6px 0 0}\n.premium-score{width:83px;height:83px;border-radius:27px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.13);\n  display:grid;place-items:center;align-content:center;text-align:center;backdrop-filter:blur(15px)}\n.premium-score span{font-size:9px;color:rgba(255,255,255,.63)}.premium-score strong{font-size:20px;margin-top:4px}\n.premium-hero-bottom{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:23px}\n.premium-hero-bottom>div{padding:11px;border-radius:16px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.08)}\n.premium-hero-bottom span,.premium-hero-bottom b{display:block}.premium-hero-bottom span{font-size:8px;color:rgba(255,255,255,.58);text-transform:uppercase}\n.premium-hero-bottom b{font-size:14px;margin-top:4px}\n\n.period-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px}\n.period-summary article{padding:14px 11px;border-radius:20px;background:linear-gradient(145deg,#151727,#111321);border:1px solid var(--line)}\n.period-summary span,.period-summary strong,.period-summary small{display:block}\n.period-summary span{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}\n.period-summary strong{font-size:18px;margin-top:6px}.period-summary small{font-size:8px;color:var(--muted);margin-top:2px}\n.period-summary article:first-child strong{color:var(--green)}\n\n.finance-chart-card{margin-top:12px;padding:17px;border-radius:23px;background:linear-gradient(145deg,#141625,#10121f);\n  border:1px solid var(--line);box-shadow:var(--shadow)}\n.chart-card-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}\n.chart-card-heading span{font-size:8px;color:var(--purple-2);font-weight:850;letter-spacing:1px}\n.chart-card-heading h3{font-size:15px;margin:4px 0 0}.chart-card-heading>strong{font-size:10px;color:var(--green);\n  padding:6px 8px;border-radius:999px;background:rgba(63,230,162,.09)}\n.svg-chart{height:150px;margin-top:14px}.svg-chart svg{width:100%;height:100%;overflow:visible}\n.wealth-area{fill:url(#wealthGradient)}.wealth-line{fill:none;stroke:#9d7cff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;\n  filter:drop-shadow(0 4px 8px rgba(139,92,246,.35));stroke-dasharray:500;stroke-dashoffset:500;animation:drawChart 1.1s ease forwards}\n.wealth-point{fill:#10121f;stroke:#c2adff;stroke-width:3;opacity:0;animation:pointIn .3s ease forwards}\n.chart-grid-line{stroke:rgba(255,255,255,.055);stroke-width:1}\n.chart-labels{display:grid;grid-template-columns:repeat(6,1fr);margin-top:5px;color:var(--muted);font-size:8px;text-align:center}\n\n.finance-chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n.finance-chart-card.compact{min-width:0}\n.bar-chart{height:145px;display:flex;align-items:flex-end;justify-content:space-between;gap:5px;padding-top:14px}\n.week-bar-column{height:100%;flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px}\n.week-bar-track{height:105px;width:100%;max-width:24px;border-radius:9px;background:rgba(255,255,255,.045);display:flex;align-items:flex-end;overflow:hidden}\n.week-bar-fill{width:100%;height:0;border-radius:9px;background:linear-gradient(180deg,#9b7cff,#5aa7ff);transition:height .7s cubic-bezier(.2,.8,.2,1)}\n.week-bar-column.today .week-bar-fill{background:linear-gradient(180deg,#54efb3,#22b98a)}\n.week-bar-column span{font-size:8px;color:var(--muted)}.week-bar-column b{font-size:7px;color:#c6c8d3;white-space:nowrap}\n\n.donut-wrap{display:flex;align-items:center;gap:13px;margin-top:16px}\n.money-donut{width:105px;height:105px;border-radius:50%;display:grid;place-items:center;position:relative;flex:none;\n  background:conic-gradient(var(--purple) 0 0%,#f06dad 0 0%,var(--blue) 0 0%,var(--green) 0 100%)}\n.money-donut:after{content:\"\";position:absolute;inset:16px;border-radius:50%;background:#121421;box-shadow:inset 0 0 0 1px var(--line)}\n.money-donut span{position:relative;z-index:1;font-size:14px;font-weight:850}\n.donut-legend{display:grid;gap:8px;flex:1}.donut-legend span{display:flex;align-items:center;gap:6px;font-size:8px;color:var(--muted)}\n.donut-legend b{margin-left:auto;color:var(--ink)}.donut-dot{width:7px;height:7px;border-radius:50%}\n.donut-dot.bills{background:var(--purple)}.donut-dot.expenses{background:#f06dad}\n.donut-dot.vault{background:var(--blue)}.donut-dot.free{background:var(--green)}\n\n.bill-card{transition:transform .18s ease,border-color .18s ease}.bill-card:active{transform:scale(.985)}\n.bill-illustration{font-family:-apple-system,BlinkMacSystemFont,sans-serif}\n.bottom-nav{background:rgba(18,20,34,.84);border-color:rgba(255,255,255,.1);box-shadow:0 25px 65px rgba(0,0,0,.58)}\n.nav-item.active{background:linear-gradient(145deg,rgba(122,82,235,.42),rgba(56,39,125,.48));box-shadow:inset 0 0 0 1px rgba(180,155,255,.22),0 8px 20px rgba(64,36,137,.16)}\n\n.calendar-day:not(.blank){cursor:pointer}.calendar-day:not(.blank):active{transform:scale(.94)}\n.day-details-panel{background:#111321;border:1px solid var(--line);border-radius:28px;padding:18px;color:var(--ink);max-height:86vh;overflow:auto}\n.day-details-summary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:17px}\n.day-details-summary article{padding:13px;border-radius:17px;background:#181a2b;border:1px solid var(--line)}\n.day-details-summary span{display:block;color:var(--muted);font-size:9px;text-transform:uppercase}\n.day-details-summary strong{display:block;font-size:17px;margin-top:5px}\n.day-details-summary .income strong{color:var(--green)}.day-details-summary .expense strong{color:#ff8ebd}\n.day-details-summary .bills strong{color:var(--purple-2)}.day-details-summary .vault strong{color:var(--blue)}\n.day-net-card{margin-top:9px;padding:15px;border-radius:18px;background:rgba(63,230,162,.08);border:1px solid rgba(63,230,162,.16);\n  display:flex;justify-content:space-between;align-items:center}\n.day-net-card span{font-size:10px;color:var(--muted)}.day-net-card strong{font-size:21px;color:var(--green)}\n.day-net-card.negative{background:rgba(255,112,132,.08);border-color:rgba(255,112,132,.16)}\n.day-net-card.negative strong{color:var(--red)}\n.day-details-list{display:grid;gap:7px;margin-top:12px}\n.day-detail-item{padding:11px 12px;border-radius:15px;background:#181a29;border:1px solid var(--line);display:flex;justify-content:space-between;gap:9px}\n.day-detail-item b,.day-detail-item small{display:block}.day-detail-item small{font-size:9px;color:var(--muted);margin-top:3px}\n.day-detail-item strong.income{color:var(--green)}.day-detail-item strong.expense{color:#ff8ebd}\n.day-detail-item strong.bills{color:var(--purple-2)}.day-detail-item strong.vault{color:var(--blue)}\n\n@keyframes drawChart{to{stroke-dashoffset:0}}\n@keyframes pointIn{to{opacity:1}}\n@media(max-width:520px){\n  .premium-hero-top>div:first-child>strong{font-size:39px}\n  .finance-chart-grid{grid-template-columns:1fr}\n  .finance-chart-card.compact{min-height:205px}\n  .bar-chart{height:130px}\n}\n\n.expense-icon.casa{background:rgba(90,167,255,.13)}\n.expense-icon.carro{background:rgba(255,189,92,.13)}\n.expense-icon.saude{background:rgba(255,112,132,.12)}\n\n\n/* ===== Central de atualizações 1.1.1 ===== */\n.updates-action{position:relative}\n.updates-version-badge{margin-left:auto;padding:5px 8px;border-radius:999px;background:rgba(90,167,255,.12);\n  color:var(--blue);font-size:9px;font-weight:850}\n.updates-dialog{width:min(94vw,680px);max-height:92vh}\n.updates-panel{background:#10121f;border:1px solid var(--line);border-radius:29px;padding:19px;color:var(--ink);\n  max-height:90vh;overflow:auto;box-shadow:0 32px 90px rgba(0,0,0,.52)}\n.updates-header{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}\n.updates-header h2{font-size:25px;margin:5px 0 4px}.updates-header p{font-size:11px;color:var(--muted);margin:0}\n.current-version-card{display:flex;align-items:center;gap:12px;margin-top:18px;padding:15px;border-radius:21px;\n  background:linear-gradient(145deg,rgba(91,67,184,.22),rgba(20,24,42,.92));border:1px solid rgba(151,124,255,.2)}\n.version-orb{width:55px;height:55px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(145deg,#8b5cf6,#4c6fff);\n  color:#fff;font-size:14px;font-weight:900;box-shadow:0 12px 25px rgba(94,70,197,.28)}\n.current-version-card>div:nth-child(2){min-width:0;flex:1}\n.current-version-card span,.current-version-card strong,.current-version-card small{display:block}\n.current-version-card>div:nth-child(2)>span{font-size:8px;letter-spacing:.8px;color:var(--muted)}\n.current-version-card strong{font-size:15px;margin-top:4px}.current-version-card small{font-size:9px;color:var(--muted);margin-top:3px}\n.version-status{padding:6px 8px;border-radius:999px;background:rgba(63,230,162,.1);color:var(--green);font-size:9px;font-weight:850}\n.updates-timeline{position:relative;margin-top:17px}\n.updates-timeline:before{content:\"\";position:absolute;left:7px;top:10px;bottom:10px;width:1px;background:rgba(255,255,255,.08)}\n.update-entry{position:relative;display:grid;grid-template-columns:16px 1fr;gap:10px;padding-bottom:14px}\n.update-entry:last-child{padding-bottom:0}.update-marker{width:15px;height:15px;border-radius:50%;background:#25283d;border:3px solid #10121f;\n  box-shadow:0 0 0 1px rgba(255,255,255,.11);z-index:1;margin-top:4px}\n.update-entry.latest .update-marker{background:var(--green);box-shadow:0 0 0 1px rgba(63,230,162,.2),0 0 18px rgba(63,230,162,.25)}\n.update-content{padding:14px;border-radius:18px;background:#171927;border:1px solid var(--line)}\n.update-entry.latest .update-content{border-color:rgba(63,230,162,.18);background:linear-gradient(145deg,rgba(63,230,162,.065),#171927)}\n.update-entry-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}\n.update-entry-head span,.update-entry-head strong{display:block}.update-entry-head span{font-size:9px;color:var(--purple-2);font-weight:850}\n.update-entry-head strong{font-size:14px;margin-top:3px}.update-entry-head>small{font-size:8px;color:var(--muted);white-space:nowrap}\n.update-content ul{margin:11px 0 0;padding-left:16px;color:#c6c8d3}.update-content li{font-size:10px;line-height:1.55;margin:4px 0}\n.update-content li::marker{color:var(--purple-2)}\n.updates-footer-note{font-size:9px;color:var(--muted);text-align:center;line-height:1.45;margin:15px 4px 1px}\n";
    document.head.appendChild(style);
  }
})();


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
  const saved=localStorage.getItem("nosso-controle-username");
  if(saved)field.value=saved;
}
async function boot(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session){show("authView");return}
  user=session.user;await loadMembership();
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
function usernameEmail(username){
  const clean=normalizeUsername(username);
  if(!clean)return "";
  const mapped=localStorage.getItem(`nosso-controle-username-email:${clean}`);
  if(mapped)return mapped;
  const savedEmail=localStorage.getItem("nosso-controle-email");
  const savedUsername=localStorage.getItem("nosso-controle-username");
  if(savedEmail&&(savedUsername===clean||savedEmail.split("@")[0].toLowerCase()===clean))return savedEmail;
  return `${clean}@nosso-controle.app`;
}
function rememberUsername(username,email){
  const clean=normalizeUsername(username);
  if(!clean||!email)return;
  localStorage.setItem("nosso-controle-username",clean);
  localStorage.setItem("nosso-controle-email",email);
  localStorage.setItem(`nosso-controle-username-email:${clean}`,email);
}
$("loginBtn").onclick=async()=>{
  feedback("authMsg","");
  const username=normalizeUsername($("email").value);
  if(!username)return feedback("authMsg","Digite seu username.");
  const email=usernameEmail(username);
  const {error}=await sb.auth.signInWithPassword({email,password:$("password").value});
  if(error)return feedback("authMsg","Username ou senha incorretos.");
  rememberUsername(username,email);
  const {data:{session}}=await sb.auth.getSession();user=session.user;
  closeKeyboardAndResetViewport(true);
  await loadMembership();
};
$("signupBtn").onclick=async()=>{
  feedback("authMsg","");
  const username=normalizeUsername($("email").value);
  if(username.length<3)return feedback("authMsg","Use um username com pelo menos 3 caracteres.");
  const email=`${username}@nosso-controle.app`;
  const {error}=await sb.auth.signUp({email,password:$("password").value,options:{data:{username}}});
  if(!error)rememberUsername(username,email);
  feedback("authMsg",error?error.message:"Conta criada. Agora toque em Entrar.");
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

boot();


/* =========================================================
   NOSSO CONTROLE 1.1.3
   Correção do menu •••, reset de dados e notas de atualização
   ========================================================= */
(function installMenuAndUpdatesFix(){
  const byId=id=>document.getElementById(id);

  function closeSettings(){
    byId("settingsSheet")?.classList.add("hidden");
  }

  function openSettings(){
    const sheet=byId("settingsSheet");
    if(!sheet)return;
    sheet.classList.remove("hidden");
  }

  function ensureUpdatesButton(){
    const admin=byId("openAdminPanel");
    if(!admin || byId("openUpdatesPanel"))return;
    admin.insertAdjacentHTML("beforebegin",`
      <button id="openUpdatesPanel" class="sheet-action updates-action" type="button">
        <span class="sheet-action-icon">↻</span>
        <span><b>Atualizações</b><small>Versão instalada, novidades e próximos passos</small></span>
        <span class="updates-version-badge">1.1.3</span>
      </button>
    `);
  }

  function ensureUpdatesDialog(){
    let dialog=byId("updatesDialog");
    if(!dialog){
      dialog=document.createElement("dialog");
      dialog.id="updatesDialog";
      dialog.className="updates-dialog";
      document.body.appendChild(dialog);
    }

    dialog.innerHTML=`
      <section class="updates-panel">
        <div class="updates-header">
          <div>
            <span class="calendar-overline">NOSSO CONTROLE</span>
            <h2>Atualizações</h2>
            <p>Versão instalada, novidades e planejamento.</p>
          </div>
          <button id="closeUpdatesPanel" class="round-button" type="button">×</button>
        </div>

        <section class="current-version-card">
          <div class="version-orb">1.1.3</div>
          <div>
            <span>VERSÃO INSTALADA</span>
            <strong>Nosso Controle 2.0.1</strong>
            <small>Correção do menu e gerenciamento de dados</small>
          </div>
          <span class="version-status">Atual</span>
        </section>

        <section class="updates-timeline">
          <article class="update-entry latest">
            <div class="update-marker"></div>
            <div class="update-content">
              <div class="update-entry-head">
                <div><span>Versão 2.0.1</span><strong>Menu e manutenção</strong></div>
                <small>03/08/2026</small>
              </div>
              <ul>
                <li>Correção do botão de três pontos.</li>
                <li>Área de atualizações funcionando.</li>
                <li>Reset de reservas e depósitos.</li>
                <li>Opção de apagar os dados financeiros com dupla confirmação.</li>
                <li>Notas organizadas por versão.</li>
              </ul>
            </div>
          </article>

          <article class="update-entry">
            <div class="update-marker"></div>
            <div class="update-content">
              <div class="update-entry-head">
                <div><span>Versão 1.1 Premium</span><strong>Experiência financeira premium</strong></div>
                <small>Instalada</small>
              </div>
              <ul>
                <li>💎 Dashboard premium.</li>
                <li>📊 Gráficos animados.</li>
                <li>💰 Ganhos diários, semanais e mensais.</li>
                <li>🏦 Cofre separado entre Cartão e Envelope.</li>
                <li>🚗 Parcelas inteligentes do carro.</li>
                <li>🧾 Bills inteligentes e editáveis.</li>
                <li>📱 Visual inspirado em aplicativo para iPhone.</li>
              </ul>
            </div>
          </article>

          <article class="update-entry planned">
            <div class="update-marker"></div>
            <div class="update-content">
              <div class="update-entry-head">
                <div><span>Versão 2.0.1</span><strong>Histórico e produtividade</strong></div>
                <small>Planejada</small>
              </div>
              <ul>
                <li>📈 Histórico financeiro completo.</li>
                <li>📆 Calendário interativo aprimorado.</li>
                <li>🔍 Pesquisa de lançamentos.</li>
                <li>🏷️ Categorias de gastos personalizáveis.</li>
                <li>📤 Exportação de relatórios em PDF.</li>
              </ul>
            </div>
          </article>

          <article class="update-entry planned">
            <div class="update-marker"></div>
            <div class="update-content">
              <div class="update-entry-head">
                <div><span>Versão 2.0.1</span><strong>Nuvem e aplicativo</strong></div>
                <small>Planejada</small>
              </div>
              <ul>
                <li>☁️ Backup na nuvem.</li>
                <li>👤 Login e perfis aprimorados.</li>
                <li>📲 Instalação com experiência de aplicativo real.</li>
                <li>🔔 Lembretes de Bills.</li>
                <li>📉 Estatísticas avançadas.</li>
              </ul>
            </div>
          </article>
        </section>

        <section class="data-maintenance-card">
          <div>
            <span class="calendar-overline">MANUTENÇÃO</span>
            <h3>Gerenciar dados</h3>
            <p>Use estas opções somente quando precisar recomeçar os registros.</p>
          </div>
          <button id="resetReservationsButton" class="secondary-button" type="button">
            Zerar reservas e depósitos
          </button>
          <button id="resetAllFinanceButton" class="danger-button" type="button">
            Apagar todos os dados financeiros
          </button>
        </section>

        <p class="updates-footer-note">
          Atualizar o aplicativo não apaga os dados armazenados no Supabase.
        </p>
      </section>
    `;
  }

  async function resetReservations(){
    if(!state)return;
    const ok=confirm(
      "Zerar todas as reservas das Bills e os depósitos destinados às contas?\n\nReceitas, gastos e Cofre serão mantidos."
    );
    if(!ok)return;

    state.cash=0;
    state.card=0;
    (state.bills||[]).forEach(b=>{
      b.reserved=0;
      if(!b.completed)b.paid=false;
    });
    state.history=(state.history||[]).filter(item=>{
      return item.type==="bill_payment";
    });

    await persist("Reservas e depósitos zerados");
    byId("updatesDialog")?.close();
  }

  async function resetAllFinance(){
    if(!state)return;
    const first=confirm(
      "ATENÇÃO: isso apagará receitas, gastos, Cofre, reservas e histórico financeiro.\n\nAs Bills cadastradas serão mantidas. Continuar?"
    );
    if(!first)return;

    const phrase=prompt('Para confirmar, digite exatamente: APAGAR');
    if(phrase!=="APAGAR"){
      toast("Operação cancelada");
      return;
    }

    state.cash=0;
    state.card=0;
    state.incomes=[];
    state.expenses=[];
    state.vaultEntries=[];
    state.history=[];
    (state.bills||[]).forEach(b=>{
      b.reserved=0;
      if(!b.completed)b.paid=false;
    });

    await persist("Dados financeiros apagados");
    byId("updatesDialog")?.close();
  }

  function bindMenu(){
    ensureUpdatesButton();
    ensureUpdatesDialog();

    const menu=byId("menuButton");
    if(menu){
      menu.onclick=null;
      menu.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        openSettings();
      });
    }

    const close=byId("closeSettings");
    if(close){
      close.onclick=null;
      close.addEventListener("click",event=>{
        event.preventDefault();
        closeSettings();
      });
    }

    const sheet=byId("settingsSheet");
    if(sheet){
      sheet.addEventListener("click",event=>{
        if(event.target===sheet)closeSettings();
      });
    }

    const updates=byId("openUpdatesPanel");
    if(updates){
      updates.onclick=event=>{
        event.preventDefault();
        closeSettings();
        ensureUpdatesDialog();
        byId("updatesDialog")?.showModal();
        bindUpdatesActions();
      };
    }

    const legacyReset=byId("resetFinance");
    if(legacyReset){
      legacyReset.onclick=event=>{
        event.preventDefault();
        resetReservations();
      };
    }
  }

  function bindUpdatesActions(){
    const close=byId("closeUpdatesPanel");
    if(close)close.onclick=()=>byId("updatesDialog")?.close();

    const soft=byId("resetReservationsButton");
    if(soft)soft.onclick=resetReservations;

    const full=byId("resetAllFinanceButton");
    if(full)full.onclick=resetAllFinance;
  }

  function addStyles(){
    if(byId("menuFixStyles"))return;
    const style=document.createElement("style");
    style.id="menuFixStyles";
    style.textContent=`
      .update-entry.planned .update-marker{
        background:#34374d;
        border-color:#10121f;
      }
      .update-entry.planned .update-content{
        opacity:.86;
        border-style:dashed;
      }
      .data-maintenance-card{
        margin-top:16px;
        padding:16px;
        border-radius:20px;
        background:#171927;
        border:1px solid var(--line);
      }
      .data-maintenance-card h3{
        margin:5px 0 4px;
        font-size:16px;
      }
      .data-maintenance-card p{
        color:var(--muted);
        font-size:10px;
        line-height:1.45;
        margin:0 0 13px;
      }
      .data-maintenance-card button+button{
        margin-top:8px;
      }
      .danger-button{
        width:100%;
        border:1px solid rgba(255,112,132,.2);
        background:rgba(255,112,132,.09);
        color:#ff8395;
        border-radius:15px;
        padding:12px;
        font-weight:800;
      }
    `;
    document.head.appendChild(style);
  }

  addStyles();
  bindMenu();
  bindUpdatesActions();

  // Reaplica os eventos caso alguma renderização futura altere a interface.
  window.addEventListener("pageshow",bindMenu);
  setTimeout(bindMenu,300);
  setTimeout(bindMenu,1200);
})();


/* =========================================================
   NOSSO CONTROLE 1.1.4 -- LAYOUT COMPACTO
   ========================================================= */
(function installCompactLayout(){
  const style=document.createElement("style");
  style.id="compactLayoutStyles";
  style.textContent=`
    :root{
      --compact-radius:18px;
      --compact-gap:9px;
    }

    body{
      font-size:14px;
    }

    .app{
      max-width:720px;
      padding-left:12px;
      padding-right:12px;
    }

    .header{
      margin-left:-12px;
      margin-right:-12px;
      padding-left:14px;
      padding-right:14px;
      padding-bottom:8px;
    }

    .header h1{
      font-size:20px;
      letter-spacing:-.35px;
    }

    .header p,
    .section-heading p{
      font-size:10px;
    }

    .app-section{
      gap:9px;
    }

    .premium-hero{
      padding:17px;
      border-radius:23px;
    }

    .premium-hero-top>div:first-child>strong{
      font-size:34px;
      margin-top:5px;
    }

    .premium-hero-top p{
      font-size:9px;
      margin-top:4px;
    }

    .premium-score{
      width:65px;
      height:65px;
      border-radius:20px;
    }

    .premium-score strong{
      font-size:16px;
    }

    .premium-hero-bottom{
      gap:6px;
      margin-top:15px;
    }

    .premium-hero-bottom>div{
      padding:8px;
      border-radius:13px;
    }

    .premium-hero-bottom b{
      font-size:12px;
    }

    .period-summary{
      gap:7px;
      margin-top:8px;
    }

    .period-summary article{
      padding:10px 8px;
      border-radius:15px;
    }

    .period-summary strong{
      font-size:15px;
      margin-top:4px;
    }

    .finance-chart-card{
      padding:13px;
      border-radius:18px;
      margin-top:8px;
    }

    .chart-card-heading h3{
      font-size:13px;
    }

    .svg-chart{
      height:105px;
      margin-top:9px;
    }

    .bar-chart{
      height:110px;
      padding-top:8px;
    }

    .week-bar-track{
      height:76px;
    }

    .donut-wrap{
      margin-top:10px;
      gap:9px;
    }

    .money-donut{
      width:80px;
      height:80px;
    }

    .money-donut:after{
      inset:12px;
    }

    .money-donut span{
      font-size:11px;
    }

    .donut-legend{
      gap:6px;
    }

    .summary-grid,
    .overview-grid,
    .quick-actions,
    .finance-chart-grid{
      gap:8px;
    }

    .summary-card,
    .overview-card,
    .quick-action,
    .bill-card,
    .expense-card,
    .vault-card,
    .income-card{
      border-radius:18px;
      padding:13px;
    }

    .summary-card strong,
    .overview-card strong{
      font-size:20px;
    }

    .quick-action{
      min-height:auto;
    }

    .quick-action h3{
      font-size:14px;
    }

    .quick-action p{
      font-size:9px;
    }

    .section-heading{
      margin-top:15px;
      margin-bottom:7px;
    }

    .section-heading h2{
      font-size:20px;
    }

    .bill-card{
      display:grid;
      gap:9px;
    }

    .bill-card h3{
      font-size:17px;
    }

    .bill-card .bill-amount,
    .bill-card .reserved-amount{
      font-size:20px;
    }

    .bill-card button,
    .primary-button,
    .secondary-button,
    .danger-button{
      padding:10px 12px;
      min-height:40px;
      border-radius:13px;
      font-size:12px;
    }

    .bill-actions{
      gap:7px;
    }

    .status-badge,
    .days-badge{
      padding:5px 8px;
      font-size:9px;
    }

    .bottom-nav{
      padding:7px;
      border-radius:22px;
    }

    .nav-item{
      padding:8px 5px;
      border-radius:16px;
    }

    .nav-item span{
      font-size:9px;
    }

    dialog{
      width:min(94vw,620px);
    }

    .updates-panel,
    .day-details-panel,
    .admin-panel,
    .calendar-panel{
      padding:15px;
      border-radius:22px;
    }

    .updates-header h2,
    .calendar-top h2{
      font-size:21px;
    }

    .current-version-card{
      padding:12px;
      border-radius:17px;
    }

    .version-orb{
      width:45px;
      height:45px;
      border-radius:14px;
      font-size:12px;
    }

    .update-content{
      padding:11px;
      border-radius:15px;
    }

    .update-content li{
      font-size:9px;
      line-height:1.45;
    }

    .day-details-summary{
      gap:6px;
      margin-top:12px;
    }

    .day-details-summary article{
      padding:10px;
      border-radius:14px;
    }

    .day-details-summary strong{
      font-size:15px;
    }

    .calendar-grid{
      gap:4px;
    }

    .calendar-day{
      min-height:43px;
      border-radius:11px;
      font-size:10px;
    }

    .calendar-day strong{
      font-size:10px;
    }

    .calendar-day small{
      font-size:7px;
    }

    .modal-card,
    .form-card{
      padding:14px;
      border-radius:19px;
    }

    input,
    select,
    textarea{
      min-height:42px;
      padding:10px 12px;
      border-radius:13px;
      font-size:14px;
    }

    .settings-sheet-content{
      max-width:520px;
      border-radius:23px 23px 0 0;
      padding:14px;
    }

    .sheet-action{
      padding:11px;
      border-radius:15px;
    }

    .sheet-action b{
      font-size:13px;
    }

    .sheet-action small{
      font-size:9px;
    }

    @media(max-width:520px){
      .premium-hero-top>div:first-child>strong{
        font-size:31px;
      }

      .finance-chart-grid{
        grid-template-columns:1fr 1fr;
      }

      .finance-chart-card.compact{
        min-height:auto;
      }

      .donut-wrap{
        align-items:flex-start;
      }

      .summary-grid,
      .overview-grid{
        grid-template-columns:1fr 1fr;
      }

      .bill-card{
        padding:12px;
      }
    }

    @media(max-width:390px){
      .finance-chart-grid{
        grid-template-columns:1fr;
      }

      .premium-hero-bottom{
        grid-template-columns:1fr 1fr 1fr;
      }

      .premium-hero-bottom span{
        font-size:7px;
      }

      .premium-hero-bottom b{
        font-size:10px;
      }
    }
  `;
  document.head.appendChild(style);

  const versionBadges=document.querySelectorAll(".updates-version-badge,.version-orb");
  versionBadges.forEach(x=>{
    if(x.textContent.trim()==="1.1.3")x.textContent="1.1.4";
  });

  document.querySelectorAll(".current-version-card strong").forEach(x=>{
    if(x.textContent.includes("1.1.3"))x.textContent="Nosso Controle 2.0.1";
  });
})();


/* =========================================================
   NOSSO CONTROLE 1.1.5 -- BILLS HORIZONTAIS E COMPACTAS
   ========================================================= */
(function installCompactBills(){
  const style=document.createElement("style");
  style.id="compactBillsStyles";
  style.textContent=`
    .bill-list{
      gap:7px !important;
    }

    .bill-group-title{
      margin:15px 3px 6px !important;
      min-height:22px;
    }

    .bill-card{
      position:relative;
      padding:11px 12px !important;
      border-radius:17px !important;
      box-shadow:0 8px 24px rgba(0,0,0,.16) !important;
      display:grid !important;
      grid-template-columns:minmax(0,1fr) auto !important;
      grid-template-areas:
        "main actions"
        "values values"
        "progress progress"
        "installment installment" !important;
      column-gap:9px !important;
      row-gap:7px !important;
      min-height:0 !important;
    }

    .bill-main{
      grid-area:main;
      min-width:0;
      gap:9px !important;
      align-items:center !important;
    }

    .bill-illustration{
      width:39px !important;
      height:39px !important;
      border-radius:12px !important;
      font-size:19px !important;
    }

    .bill-info{
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      grid-template-areas:
        "name pill"
        "due due";
      align-items:center;
      column-gap:7px;
    }

    .bill-name{
      grid-area:name;
      font-size:14px !important;
      line-height:1.15;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .bill-due{
      grid-area:due;
      font-size:9px !important;
      margin-top:3px !important;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .bill-frequency-badge{
      display:none !important;
    }

    .days-pill{
      position:absolute;
      top:10px;
      right:10px;
      padding:4px 7px !important;
      font-size:8px !important;
      max-width:104px;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .bill-main{
      padding-right:96px;
    }

    .bill-values{
      grid-area:values;
      display:flex !important;
      align-items:center;
      justify-content:flex-start;
      gap:15px !important;
      margin-top:0 !important;
      padding-left:48px;
    }

    .reserved-box,
    .remaining-box{
      display:flex !important;
      align-items:baseline;
      gap:5px;
      padding:0 !important;
      border:0 !important;
      background:transparent !important;
      min-width:0;
    }

    .bill-values span{
      font-size:8px !important;
      letter-spacing:.25px !important;
      white-space:nowrap;
    }

    .bill-values b,
    .reserved-box b,
    .remaining-box b{
      font-size:12px !important;
      margin:0 !important;
      letter-spacing:0 !important;
      white-space:nowrap;
    }

    .bill-progress{
      grid-area:progress;
      height:4px !important;
      margin:0 0 0 48px !important;
    }

    .installment-progress{
      grid-area:installment;
      margin:0 0 0 48px !important;
      padding-top:2px !important;
    }

    .installment-progress-head{
      font-size:8px !important;
    }

    .installment-progress-track{
      height:4px !important;
      margin-top:4px !important;
    }

    .bill-actions{
      grid-area:actions;
      align-self:end;
      display:flex !important;
      gap:5px !important;
      margin:0 !important;
      padding-top:31px;
    }

    .small-button{
      width:35px;
      height:32px;
      padding:0 !important;
      border-radius:10px !important;
      font-size:0 !important;
      display:grid;
      place-items:center;
    }

    .small-button.edit::before{
      content:"✎";
      font-size:15px;
    }

    .small-button.pay::before{
      content:"✓";
      font-size:16px;
    }

    .small-button.pay{
      width:39px;
    }

    @media(max-width:390px){
      .bill-card{
        grid-template-columns:minmax(0,1fr) auto !important;
      }

      .bill-main{
        padding-right:78px;
      }

      .days-pill{
        max-width:86px;
      }

      .bill-values{
        gap:10px !important;
      }

      .bill-values span{
        display:none !important;
      }

      .reserved-box::before{
        content:"Guardado";
        color:var(--muted);
        font-size:8px;
      }

      .remaining-box::before{
        content:"Falta";
        color:var(--muted);
        font-size:8px;
      }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(".updates-version-badge,.version-orb").forEach(el=>{
    if(el.textContent.trim()==="1.1.4")el.textContent="1.1.5";
  });
  document.querySelectorAll(".current-version-card strong").forEach(el=>{
    if(el.textContent.includes("1.1.4"))el.textContent="Nosso Controle 2.0.1";
  });
})();


/* =========================================================
   NOSSO CONTROLE 1.1.6
   Calendário, logout, notas organizadas e interface compacta
   ========================================================= */
(function installV116Fixes(){
  const get=id=>document.getElementById(id);

  function closeSheet(){
    get("settingsSheet")?.classList.add("hidden");
  }

  function safeShowDialog(dialog){
    if(!dialog)return;
    if(dialog.open)return;
    try{dialog.showModal()}catch{dialog.setAttribute("open","")}
  }

  function safeCloseDialog(dialog){
    if(!dialog)return;
    try{dialog.close()}catch{dialog.removeAttribute("open")}
  }

  function installCalendarEvents(){
    const open=get("openCalendar");
    const dialog=get("calendarDialog");
    const close=get("closeCalendar");
    const previous=get("calendarPrev");
    const next=get("calendarNext");

    if(open){
      open.onclick=event=>{
        event.preventDefault();
        event.stopPropagation();
        closeSheet();
        calendarDate=new Date();
        renderCalendar();
        safeShowDialog(dialog);
      };
    }

    if(close){
      close.onclick=event=>{
        event.preventDefault();
        safeCloseDialog(dialog);
      };
    }

    if(previous){
      previous.onclick=event=>{
        event.preventDefault();
        calendarDate=new Date(
          calendarDate.getFullYear(),
          calendarDate.getMonth()-1,
          1
        );
        renderCalendar();
      };
    }

    if(next){
      next.onclick=event=>{
        event.preventDefault();
        calendarDate=new Date(
          calendarDate.getFullYear(),
          calendarDate.getMonth()+1,
          1
        );
        renderCalendar();
      };
    }

    if(dialog){
      dialog.addEventListener("click",event=>{
        if(event.target===dialog)safeCloseDialog(dialog);
      });
    }

    const dayDialog=get("dayDetailsDialog");
    const closeDay=get("closeDayDetails");
    if(closeDay){
      closeDay.onclick=()=>safeCloseDialog(dayDialog);
    }
  }

  async function logout(){
    const button=get("logoutBtn");
    if(button){
      button.disabled=true;
      button.textContent="Saindo…";
    }

    try{
      if(channel){
        try{await sb.removeChannel(channel)}catch{}
        channel=null;
      }

      const {error}=await sb.auth.signOut();
      if(error)throw error;

      user=null;
      householdId=null;
      householdCode=null;
      state=null;

      document.querySelectorAll("dialog[open]").forEach(safeCloseDialog);
      closeSheet();

      const email=get("email");
      const password=get("password");
      if(email)email.value="";
      if(password)password.value="";

      show("authView");
      feedback("authMsg","Você saiu da conta.");
    }catch(error){
      toast(error?.message||"Não foi possível sair da conta");
    }finally{
      if(button){
        button.disabled=false;
        button.textContent="Sair da conta";
      }
    }
  }

  function installLogout(){
    const button=get("logoutBtn");
    if(!button)return;
    button.onclick=event=>{
      event.preventDefault();
      event.stopPropagation();
      closeSheet();
      const confirmed=confirm("Deseja realmente sair desta conta?");
      if(confirmed)logout();
    };
  }

  function rebuildUpdates(){
    const dialog=get("updatesDialog");
    if(!dialog)return;

    dialog.innerHTML=`
      <section class="updates-panel v116-updates">
        <div class="updates-header">
          <div>
            <span class="calendar-overline">NOSSO CONTROLE</span>
            <h2>Atualizações</h2>
            <p>Recursos disponíveis e próximos passos do projeto.</p>
          </div>
          <button id="closeUpdatesPanel" class="round-button" type="button">×</button>
        </div>

        <section class="current-version-card">
          <div class="version-orb">1.1.6</div>
          <div>
            <span>VERSÃO INSTALADA</span>
            <strong>Nosso Controle 2.0.1</strong>
            <small>Calendário, logout e organização visual</small>
          </div>
          <span class="version-status">Atual</span>
        </section>

        <div class="release-section">
          <div class="release-section-title">
            <span class="release-state installed">INSTALADO</span>
            <strong>Recursos disponíveis agora</strong>
          </div>

          <details class="release-card" open>
            <summary>
              <span><b>v1.1.6</b> Correções e usabilidade</span>
              <small>Atual</small>
            </summary>
            <ul>
              <li>Calendário de depósitos corrigido.</li>
              <li>Navegação entre meses funcionando.</li>
              <li>Detalhes financeiros ao tocar em um dia.</li>
              <li>Botão Sair da conta corrigido.</li>
              <li>Notas de atualização reorganizadas.</li>
              <li>Bills em formato horizontal e compacto.</li>
            </ul>
          </details>

          <details class="release-card">
            <summary>
              <span><b>v1.1 Premium</b> Dashboard financeiro</span>
              <small>Instalado</small>
            </summary>
            <ul>
              <li>Dashboard premium.</li>
              <li>Gráficos animados.</li>
              <li>Ganhos diários, semanais e mensais.</li>
              <li>Cofre separado entre Cartão e Envelope.</li>
              <li>Parcelas inteligentes do carro.</li>
              <li>Bills inteligentes e editáveis.</li>
              <li>Visual inspirado em aplicativo para iPhone.</li>
            </ul>
          </details>
        </div>

        <div class="release-section">
          <div class="release-section-title">
            <span class="release-state planned">PLANEJADO</span>
            <strong>Próximas versões</strong>
          </div>

          <details class="release-card">
            <summary>
              <span><b>v1.2</b> Histórico e produtividade</span>
              <small>Próxima</small>
            </summary>
            <ul>
              <li>Histórico financeiro completo.</li>
              <li>Calendário interativo aprimorado.</li>
              <li>Pesquisa de lançamentos.</li>
              <li>Categorias de gastos personalizáveis.</li>
              <li>Exportação de relatórios em PDF.</li>
            </ul>
          </details>

          <details class="release-card">
            <summary>
              <span><b>v1.3</b> Nuvem e aplicativo</span>
              <small>Planejada</small>
            </summary>
            <ul>
              <li>Backup na nuvem.</li>
              <li>Login e perfis aprimorados.</li>
              <li>Instalação com experiência de aplicativo real.</li>
              <li>Lembretes de Bills.</li>
              <li>Estatísticas avançadas.</li>
            </ul>
          </details>
        </div>

        <section class="data-maintenance-card">
          <span class="calendar-overline">MANUTENÇÃO</span>
          <h3>Gerenciar dados</h3>
          <p>As atualizações não apagam os dados salvos no Supabase.</p>
          <button id="resetReservationsButton" class="secondary-button" type="button">
            Zerar reservas e depósitos
          </button>
          <button id="resetAllFinanceButton" class="danger-button" type="button">
            Apagar todos os dados financeiros
          </button>
        </section>
      </section>
    `;

    get("closeUpdatesPanel").onclick=()=>safeCloseDialog(dialog);

    get("resetReservationsButton").onclick=async()=>{
      const ok=confirm(
        "Zerar reservas das Bills e depósitos destinados às contas? Receitas, gastos e Cofre serão mantidos."
      );
      if(!ok)return;

      state.cash=0;
      state.card=0;
      (state.bills||[]).forEach(bill=>{
        bill.reserved=0;
        if(!bill.completed)bill.paid=false;
      });
      state.history=(state.history||[]).filter(item=>item.type==="bill_payment");
      await persist("Reservas e depósitos zerados");
      safeCloseDialog(dialog);
    };

    get("resetAllFinanceButton").onclick=async()=>{
      const ok=confirm(
        "Isso apagará receitas, gastos, Cofre, reservas e histórico. As Bills cadastradas serão mantidas. Continuar?"
      );
      if(!ok)return;

      const phrase=prompt('Digite APAGAR para confirmar');
      if(phrase!=="APAGAR")return toast("Operação cancelada");

      state.cash=0;
      state.card=0;
      state.incomes=[];
      state.expenses=[];
      state.vaultEntries=[];
      state.history=[];
      (state.bills||[]).forEach(bill=>{
        bill.reserved=0;
        if(!bill.completed)bill.paid=false;
      });

      await persist("Dados financeiros apagados");
      safeCloseDialog(dialog);
    };
  }

  function installUpdateEvents(){
    const open=get("openUpdatesPanel");
    const dialog=get("updatesDialog");
    if(!open||!dialog)return;

    open.onclick=event=>{
      event.preventDefault();
      event.stopPropagation();
      closeSheet();
      rebuildUpdates();
      safeShowDialog(dialog);
    };
  }

  function addStyles(){
    if(get("v116Styles"))return;
    const style=document.createElement("style");
    style.id="v116Styles";
    style.textContent=`
      .v116-updates{
        padding:14px !important;
      }

      .release-section{
        margin-top:14px;
      }

      .release-section-title{
        display:flex;
        align-items:center;
        gap:8px;
        margin:0 2px 7px;
      }

      .release-section-title strong{
        font-size:12px;
      }

      .release-state{
        padding:4px 7px;
        border-radius:999px;
        font-size:7px;
        font-weight:900;
        letter-spacing:.7px;
      }

      .release-state.installed{
        color:var(--green);
        background:rgba(63,230,162,.09);
      }

      .release-state.planned{
        color:var(--purple-2);
        background:rgba(139,92,246,.1);
      }

      .release-card{
        margin-top:6px;
        border-radius:14px;
        background:#171927;
        border:1px solid var(--line);
        overflow:hidden;
      }

      .release-card summary{
        list-style:none;
        cursor:pointer;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        padding:11px 12px;
      }

      .release-card summary::-webkit-details-marker{
        display:none;
      }

      .release-card summary span{
        font-size:11px;
      }

      .release-card summary small{
        color:var(--muted);
        font-size:8px;
      }

      .release-card[open] summary{
        border-bottom:1px solid var(--line);
      }

      .release-card ul{
        margin:0;
        padding:9px 12px 10px 28px;
      }

      .release-card li{
        margin:3px 0;
        color:#c8cad5;
        font-size:9px;
        line-height:1.45;
      }

      .calendar-dialog,
      .day-details-panel{
        z-index:80;
      }

      .calendar-nav-button{
        min-width:36px;
        min-height:34px;
      }

      #logoutBtn{
        color:#ff8798;
        border-color:rgba(255,112,132,.14);
        background:rgba(255,112,132,.055);
      }
    `;
    document.head.appendChild(style);
  }

  function installAll(){
    addStyles();
    installCalendarEvents();
    installLogout();
    rebuildUpdates();
    installUpdateEvents();

    document.querySelectorAll(".updates-version-badge,.version-orb").forEach(el=>{
      if(/^1\.1\./.test(el.textContent.trim()))el.textContent="1.1.6";
    });
  }

  installAll();
  window.addEventListener("pageshow",installAll);
  setTimeout(installAll,250);
  setTimeout(installAll,1000);
})();


/* =========================================================
   NOSSO CONTROLE 1.2 -- PREMIUM, CONTA COMPARTILHADA E UX
   ========================================================= */
(function installV12Premium(){
  const get=id=>document.getElementById(id);
  const escapeHtml=value=>String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  function copyText(value,successMessage="Copiado"){
    if(!value)return;
    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(value)
        .then(()=>toast(successMessage))
        .catch(()=>fallbackCopy(value,successMessage));
    }else fallbackCopy(value,successMessage);
  }

  function fallbackCopy(value,successMessage){
    const area=document.createElement("textarea");
    area.value=value;
    area.style.position="fixed";
    area.style.opacity="0";
    document.body.appendChild(area);
    area.select();
    try{
      document.execCommand("copy");
      toast(successMessage);
    }catch{
      prompt("Copie o código:",value);
    }
    area.remove();
  }

  function rememberEmail(){
    const field=get("email");
    if(!field)return;
    const email=field.value.trim();
    if(email)localStorage.setItem("nosso-controle-email",email);
  }

  function restoreRememberedEmail(){
    const field=get("email");
    if(!field || field.value)return;
    const saved=localStorage.getItem("nosso-controle-email");
    if(saved)field.value=saved;
  }

  function enhanceAuth(){
    const authPanel=document.querySelector("#authView .auth-panel");
    if(!authPanel)return;

    restoreRememberedEmail();

    if(!get("authConvenience")){
      authPanel.insertAdjacentHTML("beforeend",`
        <section id="authConvenience" class="auth-convenience">
          <div class="auth-session-info">
            <span class="auth-session-icon">✓</span>
            <div>
              <strong>Login automático</strong>
              <small>Depois de entrar, sua sessão ficará salva neste iPhone.</small>
            </div>
          </div>
          <p>
            Sua namorada deve tocar em <b>Criar conta</b>, usar o próprio e-mail
            e, após entrar, escolher <b>Usar código da casa</b>.
          </p>
        </section>
      `);
    }

    const login=get("loginBtn");
    if(login && !login.dataset.v12){
      login.dataset.v12="1";
      login.addEventListener("click",rememberEmail,{capture:true});
    }

    const signup=get("signupBtn");
    if(signup){
      signup.textContent="Criar minha conta";
      if(!signup.dataset.v12){
        signup.dataset.v12="1";
        signup.addEventListener("click",rememberEmail,{capture:true});
      }
    }

    const email=get("email");
    if(email){
      email.addEventListener("change",rememberEmail);
      email.setAttribute("autocapitalize","none");
      email.setAttribute("spellcheck","false");
    }
  }

  function enhanceHouseholdOnboarding(){
    const view=get("householdView");
    if(!view)return;

    const panel=view.querySelector(".panel") || view.querySelector("section");
    if(!panel)return;

    const title=panel.querySelector("h1,h2");
    if(title)title.textContent="Conectar as contas do casal";

    const intro=panel.querySelector("p");
    if(intro){
      intro.textContent="Cada pessoa usa seu próprio login, mas os dois compartilham os mesmos ganhos, Bills, gastos e Cofre.";
    }

    const create=get("createHouseholdBtn");
    if(create)create.textContent="Criar nossa casa";

    const join=get("joinHouseholdBtn");
    if(join)join.textContent="Usar código da casa";

    const code=get("joinCode");
    if(code){
      code.placeholder="Digite o código do Lucas";
      code.setAttribute("autocapitalize","characters");
    }

    if(!get("householdGuide")){
      panel.insertAdjacentHTML("beforeend",`
        <section id="householdGuide" class="household-guide">
          <article>
            <span>1</span>
            <div><strong>Lucas cria a casa</strong><small>O aplicativo gera um código único.</small></div>
          </article>
          <article>
            <span>2</span>
            <div><strong>Sua namorada cria a conta dela</strong><small>Ela não precisa usar sua senha.</small></div>
          </article>
          <article>
            <span>3</span>
            <div><strong>Ela digita o código</strong><small>A partir daí, os dados ficam sincronizados.</small></div>
          </article>
        </section>
      `);
    }
  }

  function rebuildSettings(){
    const sheet=get("settingsSheet");
    if(!sheet)return;

    let content=sheet.querySelector(".settings-sheet");
    if(!content)return;

    const email=user?.email || localStorage.getItem("nosso-controle-email") || "Conta conectada";
    const code=householdCode || "--";

    content.innerHTML=`
      <div class="settings-premium-head">
        <div>
          <span>CONFIGURAÇÕES</span>
          <h2>Nosso Controle</h2>
          <p>Conta, compartilhamento e ferramentas.</p>
        </div>
        <button id="closeSettings" class="round-button" type="button">×</button>
      </div>

      <section class="settings-account-card">
        <div class="settings-avatar">${escapeHtml(email.charAt(0).toUpperCase())}</div>
        <div>
          <span>CONTA CONECTADA</span>
          <strong>${escapeHtml(email)}</strong>
          <small>Sessão salva neste aparelho</small>
        </div>
        <span class="account-online-dot"></span>
      </section>

      <section class="settings-group">
        <div class="settings-group-title">
          <span>CASA COMPARTILHADA</span>
          <small>Sincronização do casal</small>
        </div>

        <button id="copyHouseholdCode" class="settings-row code-row" type="button">
          <span class="settings-row-icon purple">⌁</span>
          <span class="settings-row-copy">
            <b>Código da casa</b>
            <small>Sua namorada usa este código após criar a conta</small>
          </span>
          <strong>${escapeHtml(code)}</strong>
        </button>

        <button id="shareHouseholdCode" class="settings-row" type="button">
          <span class="settings-row-icon blue">↗</span>
          <span class="settings-row-copy">
            <b>Compartilhar código</b>
            <small>Enviar pelo WhatsApp ou Mensagens</small>
          </span>
          <span class="settings-chevron">›</span>
        </button>
      </section>

      <section class="settings-group">
        <div class="settings-group-title">
          <span>CONTROLE</span>
          <small>Ferramentas financeiras</small>
        </div>

        <button id="openCalendar" class="settings-row" type="button">
          <span class="settings-row-icon green">▦</span>
          <span class="settings-row-copy"><b>Calendário financeiro</b><small>Depósitos, metas e detalhes por dia</small></span>
          <span class="settings-chevron">›</span>
        </button>

        <button id="openCompletedBills" class="settings-row" type="button">
          <span class="settings-row-icon amber">✓</span>
          <span class="settings-row-copy"><b>Bills concluídas</b><small>Parcelamentos e contas finalizadas</small></span>
          <span class="settings-chevron">›</span>
        </button>

        <button id="openAdminPanel" class="settings-row" type="button">
          <span class="settings-row-icon purple">⚙</span>
          <span class="settings-row-copy"><b>Gerenciar dados</b><small>Bills, lançamentos, reservas e reset</small></span>
          <span class="settings-chevron">›</span>
        </button>
      </section>

      <section class="settings-group">
        <div class="settings-group-title">
          <span>APLICATIVO</span>
          <small>Versão e novidades</small>
        </div>

        <button id="openUpdatesPanel" class="settings-row" type="button">
          <span class="settings-row-icon blue">↻</span>
          <span class="settings-row-copy"><b>Atualizações</b><small>Recursos instalados e próximos passos</small></span>
          <span class="settings-version">1.2</span>
        </button>
      </section>

      <button id="logoutBtn" class="settings-logout" type="button">
        <span>⇥</span>
        Sair da conta
      </button>
    `;

    bindSettingsEvents();
  }

  function closeSettings(){
    get("settingsSheet")?.classList.add("hidden");
  }

  function bindSettingsEvents(){
    const close=get("closeSettings");
    if(close)close.onclick=closeSettings;

    const copy=get("copyHouseholdCode");
    if(copy)copy.onclick=()=>copyText(householdCode,"Código da casa copiado");

    const share=get("shareHouseholdCode");
    if(share){
      share.onclick=async()=>{
        const message=`Entre na nossa casa no Nosso Controle usando o código: ${householdCode}`;
        if(navigator.share){
          try{
            await navigator.share({title:"Nosso Controle",text:message});
          }catch{}
        }else copyText(message,"Mensagem copiada");
      };
    }

    const calendar=get("openCalendar");
    if(calendar){
      calendar.onclick=event=>{
        event.preventDefault();
        closeSettings();
        calendarDate=new Date();
        renderCalendar();
        get("calendarDialog")?.showModal();
      };
    }

    const completed=get("openCompletedBills");
    if(completed){
      completed.onclick=event=>{
        event.preventDefault();
        closeSettings();
        renderCompletedBills();
        get("completedBillsDialog")?.showModal();
      };
    }

    const admin=get("openAdminPanel");
    if(admin){
      admin.onclick=event=>{
        event.preventDefault();
        closeSettings();
        openAdminPanel();
      };
    }

    const updates=get("openUpdatesPanel");
    if(updates){
      updates.onclick=event=>{
        event.preventDefault();
        closeSettings();
        const dialog=get("updatesDialog");
        if(dialog){
          try{dialog.showModal()}catch{dialog.setAttribute("open","")}
        }
      };
    }

    const logout=get("logoutBtn");
    if(logout){
      logout.onclick=async event=>{
        event.preventDefault();
        if(!confirm("Deseja sair desta conta neste iPhone?"))return;
        logout.disabled=true;
        logout.innerHTML="<span>…</span> Saindo";
        try{
          if(channel){
            try{await sb.removeChannel(channel)}catch{}
            channel=null;
          }
          const {error}=await sb.auth.signOut();
          if(error)throw error;
          user=null;
          householdId=null;
          householdCode=null;
          state=null;
          document.querySelectorAll("dialog[open]").forEach(dialog=>{
            try{dialog.close()}catch{dialog.removeAttribute("open")}
          });
          closeSettings();
          show("authView");
          restoreRememberedEmail();
          const password=get("password");
          if(password)password.value="";
          feedback("authMsg","Você saiu da conta.");
        }catch(error){
          toast(error?.message||"Não foi possível sair");
          rebuildSettings();
        }
      };
    }
  }

  function installMenuRebuild(){
    const menu=get("menuButton");
    if(!menu)return;
    menu.onclick=event=>{
      event.preventDefault();
      event.stopPropagation();
      rebuildSettings();
      get("settingsSheet")?.classList.remove("hidden");
    };
  }

  function improveUpdateNotes(){
    const dialog=get("updatesDialog");
    if(!dialog)return;

    const current=dialog.querySelector(".current-version-card");
    if(current){
      const orb=current.querySelector(".version-orb");
      const strong=current.querySelector("strong");
      const small=current.querySelector("small");
      if(orb)orb.textContent="1.2";
      if(strong)strong.textContent="Nosso Controle 2.0.1";
      if(small)small.textContent="Experiência premium e conta compartilhada";
    }

    const panel=dialog.querySelector(".updates-panel");
    if(panel && !panel.querySelector(".v12-release-note")){
      const firstRelease=panel.querySelector(".release-section,.updates-timeline");
      const note=document.createElement("section");
      note.className="v12-release-note";
      note.innerHTML=`
        <span>VERSÃO 1.2 · INSTALADA</span>
        <h3>Mais simples para usar todos os dias</h3>
        <ul>
          <li>Menu inferior maior e mais legível.</li>
          <li>Visão Geral mais limpa, sem botão duplicado.</li>
          <li>Bills compactas mostrando o valor total completo.</li>
          <li>Configurações reorganizadas por categoria.</li>
          <li>Sessão persistente: não exige login a cada acesso.</li>
          <li>Fluxo claro para o casal usar logins separados e o mesmo código.</li>
          <li>Refinamentos de espaçamento e hierarquia visual.</li>
        </ul>
      `;
      if(firstRelease)panel.insertBefore(note,firstRelease);
      else panel.appendChild(note);
    }
  }

  function addStyles(){
    if(get("v12PremiumStyles"))return;
    const style=document.createElement("style");
    style.id="v12PremiumStyles";
    style.textContent=`
      /* Menu inferior mais legível */
      .bottom-nav{
        padding:7px 8px calc(7px + env(safe-area-inset-bottom)) !important;
        gap:4px !important;
      }
      .nav-item{
        min-height:58px !important;
        padding:8px 5px !important;
      }
      .nav-item span{
        font-size:15px !important;
        line-height:1 !important;
      }
      .nav-item b{
        font-size:11px !important;
        letter-spacing:.75px !important;
        margin-top:5px !important;
      }

      /* Remove o botão + duplicado da Visão Geral */
      #openIncome{
        display:none !important;
      }
      .overview-header{
        padding-right:0 !important;
      }

      /* Bills: total completo, sem reticências */
      .bill-info{
        min-width:0 !important;
      }
      .bill-due{
        white-space:normal !important;
        overflow:visible !important;
        text-overflow:clip !important;
        line-height:1.35 !important;
        max-width:none !important;
        padding-right:4px;
      }
      .bill-name{
        max-width:none !important;
      }
      .bill-card{
        overflow:visible !important;
      }
      .bill-main{
        min-width:0 !important;
      }

      /* Configurações premium */
      .settings-sheet{
        padding:15px 14px calc(18px + env(safe-area-inset-bottom)) !important;
        max-height:88vh !important;
        overflow:auto !important;
        background:
          radial-gradient(circle at 85% 0,rgba(124,82,255,.11),transparent 32%),
          #10121e !important;
      }
      .settings-premium-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
        padding:3px 2px 13px;
      }
      .settings-premium-head>div>span{
        color:var(--purple-2);
        font-size:8px;
        font-weight:900;
        letter-spacing:1.2px;
      }
      .settings-premium-head h2{
        margin:5px 0 3px;
        font-size:22px;
      }
      .settings-premium-head p{
        margin:0;
        color:var(--muted);
        font-size:9px;
      }
      .settings-account-card{
        display:flex;
        align-items:center;
        gap:11px;
        padding:12px;
        margin-bottom:12px;
        border-radius:17px;
        border:1px solid rgba(255,255,255,.075);
        background:linear-gradient(145deg,rgba(139,92,246,.1),rgba(21,23,39,.96));
      }
      .settings-avatar{
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        flex:none;
        border-radius:14px;
        color:#fff;
        font-size:16px;
        font-weight:900;
        background:linear-gradient(145deg,#8b5cf6,#4c6fff);
      }
      .settings-account-card>div:nth-child(2){
        min-width:0;
        flex:1;
      }
      .settings-account-card span,
      .settings-account-card strong,
      .settings-account-card small{
        display:block;
      }
      .settings-account-card>div:nth-child(2)>span{
        color:var(--muted);
        font-size:7px;
        letter-spacing:.8px;
      }
      .settings-account-card strong{
        margin-top:3px;
        font-size:11px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .settings-account-card small{
        margin-top:3px;
        color:var(--muted);
        font-size:8px;
      }
      .account-online-dot{
        width:8px;
        height:8px;
        border-radius:50%;
        background:var(--green);
        box-shadow:0 0 12px rgba(63,230,162,.5);
      }
      .settings-group{
        padding:7px;
        margin-top:9px;
        border:1px solid rgba(255,255,255,.065);
        border-radius:17px;
        background:rgba(22,24,40,.72);
      }
      .settings-group-title{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:4px 5px 7px;
      }
      .settings-group-title span{
        color:var(--muted);
        font-size:7px;
        font-weight:900;
        letter-spacing:1px;
      }
      .settings-group-title small{
        color:#777b8e;
        font-size:7px;
      }
      .settings-row{
        width:100%;
        border:0;
        display:flex;
        align-items:center;
        gap:10px;
        min-height:55px;
        padding:8px;
        text-align:left;
        color:var(--ink);
        background:transparent;
        border-radius:12px;
      }
      .settings-row+ .settings-row{
        border-top:1px solid rgba(255,255,255,.055);
        border-radius:0;
      }
      .settings-row:active{
        background:rgba(255,255,255,.035);
      }
      .settings-row-icon{
        width:34px;
        height:34px;
        flex:none;
        display:grid;
        place-items:center;
        border-radius:11px;
        font-size:15px;
        font-weight:850;
      }
      .settings-row-icon.purple{background:rgba(139,92,246,.13);color:#b79cff}
      .settings-row-icon.blue{background:rgba(90,167,255,.12);color:#7abbff}
      .settings-row-icon.green{background:rgba(63,230,162,.1);color:var(--green)}
      .settings-row-icon.amber{background:rgba(255,189,92,.11);color:#ffc76e}
      .settings-row-copy{
        min-width:0;
        flex:1;
      }
      .settings-row-copy b,
      .settings-row-copy small{
        display:block;
      }
      .settings-row-copy b{
        font-size:12px;
      }
      .settings-row-copy small{
        margin-top:3px;
        color:var(--muted);
        font-size:8px;
        line-height:1.35;
      }
      .settings-chevron{
        color:#73778b;
        font-size:20px;
      }
      .code-row>strong{
        color:var(--purple-2);
        font-size:11px;
        letter-spacing:.7px;
      }
      .settings-version{
        padding:5px 8px;
        border-radius:999px;
        color:var(--blue);
        background:rgba(90,167,255,.1);
        font-size:9px;
        font-weight:900;
      }
      .settings-logout{
        width:100%;
        margin-top:12px;
        padding:12px;
        border-radius:14px;
        border:1px solid rgba(255,112,132,.12);
        color:#ff899a;
        background:rgba(255,112,132,.055);
        font-size:11px;
        font-weight:800;
      }

      /* Login e onboarding */
      .auth-convenience{
        margin-top:12px;
        padding:11px;
        border-radius:15px;
        border:1px solid rgba(63,230,162,.11);
        background:rgba(63,230,162,.045);
      }
      .auth-session-info{
        display:flex;
        gap:9px;
        align-items:center;
      }
      .auth-session-icon{
        width:29px;
        height:29px;
        display:grid;
        place-items:center;
        flex:none;
        border-radius:10px;
        color:var(--green);
        background:rgba(63,230,162,.1);
      }
      .auth-session-info strong,
      .auth-session-info small{
        display:block;
      }
      .auth-session-info strong{
        font-size:10px;
      }
      .auth-session-info small{
        color:var(--muted);
        font-size:8px;
        margin-top:2px;
      }
      .auth-convenience p{
        margin:9px 0 0;
        color:var(--muted);
        font-size:8px;
        line-height:1.5;
      }
      .household-guide{
        display:grid;
        gap:7px;
        margin-top:12px;
      }
      .household-guide article{
        display:flex;
        gap:9px;
        align-items:center;
        padding:9px;
        border-radius:13px;
        border:1px solid rgba(255,255,255,.06);
        background:rgba(255,255,255,.025);
      }
      .household-guide article>span{
        width:27px;
        height:27px;
        display:grid;
        place-items:center;
        flex:none;
        border-radius:9px;
        color:var(--purple-2);
        background:rgba(139,92,246,.11);
        font-size:10px;
        font-weight:900;
      }
      .household-guide strong,
      .household-guide small{
        display:block;
      }
      .household-guide strong{font-size:10px}
      .household-guide small{
        color:var(--muted);
        font-size:8px;
        margin-top:2px;
      }

      /* Nota de versão */
      .v12-release-note{
        margin-top:12px;
        padding:13px;
        border-radius:17px;
        border:1px solid rgba(63,230,162,.13);
        background:linear-gradient(145deg,rgba(63,230,162,.06),rgba(19,22,36,.95));
      }
      .v12-release-note>span{
        color:var(--green);
        font-size:7px;
        font-weight:900;
        letter-spacing:1px;
      }
      .v12-release-note h3{
        margin:5px 0 8px;
        font-size:14px;
      }
      .v12-release-note ul{
        margin:0;
        padding-left:17px;
      }
      .v12-release-note li{
        margin:3px 0;
        color:#c7cad5;
        font-size:8px;
        line-height:1.45;
      }

      /* Refinamentos gerais premium */
      .section-page-header{
        margin-bottom:11px !important;
      }
      .daily-flow-card,
      .net-balance-card,
      .overview-metric,
      .vault-location-overview{
        box-shadow:0 14px 38px rgba(0,0,0,.17) !important;
      }
      button{
        -webkit-tap-highlight-color:transparent;
      }
    `;
    document.head.appendChild(style);
  }

  function installSessionListener(){
    if(window.__nossoControleAuthListenerV12)return;
    window.__nossoControleAuthListenerV12=true;

    sb.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_IN" && session?.user && !user){
        user=session.user;
        rememberEmail();
        try{await loadMembership()}catch{}
      }
      if(event==="TOKEN_REFRESHED" && session?.user){
        user=session.user;
      }
    });
  }

  function install(){
    addStyles();
    enhanceAuth();
    enhanceHouseholdOnboarding();
    installMenuRebuild();
    improveUpdateNotes();
    installSessionListener();

    document.querySelectorAll(".updates-version-badge,.version-orb").forEach(el=>{
      if(/^1\./.test(el.textContent.trim()))el.textContent="1.2";
    });
  }

  install();
  window.addEventListener("pageshow",install);
  setTimeout(install,250);
  setTimeout(install,1000);
})();


/* =========================================================
   NOSSO CONTROLE 1.3 PREMIUM
   Datas, pesquisa, histórico, PDF, backup, alertas e estatísticas
   ========================================================= */
(function installV13Premium(){
  const get=id=>document.getElementById(id);
  const moneySafe=value=>{
    try{return money(Number(value||0))}
    catch{return `£${Number(value||0).toFixed(2)}`}
  };
  const dateKey=value=>{
    if(!value)return "";
    if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
    const d=new Date(value);
    return Number.isNaN(d.getTime())?"":`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const formatDateLong=value=>{
    if(!value)return "Sem data";
    return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",year:"numeric"})
      .format(new Date(`${dateKey(value)}T12:00:00`));
  };
  const escapeHTML=value=>String(value??"")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");

  const billIcon=name=>{
    const value=String(name||"").toLowerCase();
    if(value.includes("alug"))return "⌂";
    if(value.includes("energia")||value.includes("edf")||value.includes("electric"))return "⚡";
    if(value.includes("água")||value.includes("agua")||value.includes("water"))return "◉";
    if(value.includes("council")||value.includes("consult"))return "▦";
    if(value.includes("carro")||value.includes("seguro"))return "🚘";
    if(value.includes("internet")||value.includes("bt"))return "⌁";
    if(value.includes("netflix")||value.includes("tv"))return "▶";
    if(value.includes("telefone")||value.includes("phone"))return "▯";
    return "£";
  };

  function ensureDateFields(){
    const configs=[
      ["incomeDialog","incomeDate","Data da receita"],
      ["expenseDialog","expenseDate","Data do gasto"],
      ["vaultDialog","vaultDate","Data do depósito"],
      ["billCreateDialog","newBillDue","Data do primeiro vencimento"]
    ];

    configs.forEach(([dialogId,inputId,labelText])=>{
      const dialog=get(dialogId);
      const input=get(inputId);
      if(!dialog||!input)return;

      input.type="date";
      input.classList.add("v13-date-input");

      const label=input.closest("label");
      if(label){
        const textNodes=[...label.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE);
        if(textNodes[0])textNodes[0].textContent=labelText;
      }

      if(!input.value)input.value=currentLocalDate();
    });
  }

  function ensureDateDefaults(){
    ["incomeDate","expenseDate","vaultDate","newBillDue"].forEach(id=>{
      const input=get(id);
      if(input&&!input.value)input.value=currentLocalDate();
    });
  }

  function createInsightsView(){
    if(get("insightsDialog"))return;

    const dialog=document.createElement("dialog");
    dialog.id="insightsDialog";
    dialog.className="insights-dialog";
    dialog.innerHTML=`
      <section class="insights-panel">
        <div class="insights-header">
          <div>
            <span class="calendar-overline">ANÁLISES</span>
            <h2>Histórico e estatísticas</h2>
            <p>Pesquise, filtre e entenda para onde o dinheiro foi.</p>
          </div>
          <button id="closeInsights" class="round-button" type="button">×</button>
        </div>

        <section class="insights-search-card">
          <label class="global-search">
            <span>⌕</span>
            <input id="globalFinanceSearch" type="search" placeholder="Pesquisar receitas, gastos, Bills…">
          </label>
          <div class="insights-filters">
            <select id="insightsTypeFilter">
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Gastos</option>
              <option value="vault">Cofre</option>
              <option value="bill">Bills pagas</option>
            </select>
            <input id="insightsMonthFilter" type="month">
          </div>
        </section>

        <section class="insights-kpis">
          <article><span>Receitas</span><strong id="insightsIncome">£0,00</strong></article>
          <article><span>Saídas</span><strong id="insightsOut">£0,00</strong></article>
          <article><span>Saldo</span><strong id="insightsBalance">£0,00</strong></article>
          <article><span>Lançamentos</span><strong id="insightsCount">0</strong></article>
        </section>

        <section class="category-analysis">
          <div class="insights-section-title">
            <div><span>CATEGORIAS</span><h3>Gastos por categoria</h3></div>
          </div>
          <div id="categoryBars" class="category-bars"></div>
        </section>

        <section class="history-analysis">
          <div class="insights-section-title">
            <div><span>HISTÓRICO</span><h3>Movimentações</h3></div>
            <button id="exportPdfButton" class="mini-action-button" type="button">PDF</button>
          </div>
          <div id="globalHistoryList" class="global-history-list"></div>
        </section>
      </section>
    `;
    document.body.appendChild(dialog);

    get("closeInsights").onclick=()=>dialog.close();
    get("globalFinanceSearch").oninput=renderInsights;
    get("insightsTypeFilter").onchange=renderInsights;
    get("insightsMonthFilter").onchange=renderInsights;
    get("exportPdfButton").onclick=exportFinancialPdf;
  }

  function allFinancialItems(){
    const incomes=(state?.incomes||[]).map(x=>({
      id:x.id,type:"income",date:dateKey(x.date),title:x.description||"Receita",
      category:"Receita",amount:Number(x.amount||0),sign:1
    }));
    const expenses=(state?.expenses||[]).map(x=>({
      id:x.id,type:"expense",date:dateKey(x.date),title:x.description||expenseNames?.[x.category]||"Gasto",
      category:expenseNames?.[x.category]||x.category||"Outros",amount:Number(x.amount||0),sign:-1
    }));
    const vault=(state?.vaultEntries||[]).map(x=>({
      id:x.id,type:"vault",date:dateKey(x.date),title:x.description||"Cofre",
      category:(x.location||"envelope")==="card"?"Cofre · Cartão":"Cofre · Envelope",
      amount:Number(x.amount||0),sign:-1
    }));
    const bills=(state?.history||[])
      .filter(x=>x.type==="bill_payment")
      .map(x=>({
        id:x.id,type:"bill",date:dateKey(x.date),title:x.bill||x.text||"Bill paga",
        category:"Bill paga",amount:Number(x.amount||0),sign:-1
      }));

    return [...incomes,...expenses,...vault,...bills]
      .filter(x=>x.date)
      .sort((a,b)=>b.date.localeCompare(a.date));
  }

  function renderInsights(){
    if(!state)return;
    createInsightsView();

    const query=(get("globalFinanceSearch")?.value||"").trim().toLowerCase();
    const type=get("insightsTypeFilter")?.value||"all";
    const month=get("insightsMonthFilter")?.value||"";

    let items=allFinancialItems().filter(item=>{
      if(type!=="all"&&item.type!==type)return false;
      if(month&&!item.date.startsWith(month))return false;
      if(query&&!`${item.title} ${item.category}`.toLowerCase().includes(query))return false;
      return true;
    });

    const income=items.filter(x=>x.sign>0).reduce((s,x)=>s+x.amount,0);
    const out=items.filter(x=>x.sign<0).reduce((s,x)=>s+x.amount,0);
    const balance=income-out;

    get("insightsIncome").textContent=moneySafe(income);
    get("insightsOut").textContent=moneySafe(out);
    get("insightsBalance").textContent=moneySafe(balance);
    get("insightsBalance").classList.toggle("negative",balance<0);
    get("insightsCount").textContent=String(items.length);

    const categories={};
    items.filter(x=>x.type==="expense").forEach(x=>{
      categories[x.category]=(categories[x.category]||0)+x.amount;
    });
    const maxCategory=Math.max(1,...Object.values(categories));
    get("categoryBars").innerHTML=Object.entries(categories)
      .sort((a,b)=>b[1]-a[1])
      .map(([name,value])=>`
        <article class="category-bar-row">
          <div><span>${escapeHTML(name)}</span><strong>${moneySafe(value)}</strong></div>
          <div class="category-bar-track"><i style="width:${(value/maxCategory)*100}%"></i></div>
        </article>
      `).join("")||'<div class="empty-state">Nenhum gasto para este filtro.</div>';

    get("globalHistoryList").innerHTML=items.map(item=>`
      <article class="global-history-item">
        <span class="history-type-icon ${item.type}">
          ${item.type==="income"?"＋":item.type==="expense"?"−":item.type==="vault"?"◆":"✓"}
        </span>
        <div>
          <strong>${escapeHTML(item.title)}</strong>
          <small>${escapeHTML(item.category)} · ${formatDateLong(item.date)}</small>
        </div>
        <b class="${item.sign>0?"positive":"negative"}">${item.sign>0?"+":"−"}${moneySafe(item.amount)}</b>
      </article>
    `).join("")||'<div class="empty-state">Nenhuma movimentação encontrada.</div>';
  }

  function exportFinancialPdf(){
    const items=allFinancialItems();
    const income=items.filter(x=>x.sign>0).reduce((s,x)=>s+x.amount,0);
    const out=items.filter(x=>x.sign<0).reduce((s,x)=>s+x.amount,0);

    const rows=items.map(item=>`
      <tr>
        <td>${escapeHTML(formatDateLong(item.date))}</td>
        <td>${escapeHTML(item.title)}</td>
        <td>${escapeHTML(item.category)}</td>
        <td class="${item.sign>0?"positive":"negative"}">
          ${item.sign>0?"+":"−"}${escapeHTML(moneySafe(item.amount))}
        </td>
      </tr>
    `).join("");

    const report=window.open("","_blank");
    if(!report)return toast("Permita pop-ups para gerar o relatório");

    report.document.write(`<!doctype html>
      <html lang="pt-BR"><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Relatório Nosso Controle</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;padding:28px;color:#171923}
        h1{margin:0 0 4px}.muted{color:#777}
        .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:22px 0}
        .summary div{padding:14px;border:1px solid #ddd;border-radius:12px}
        .summary span,.summary strong{display:block}.summary span{font-size:11px;color:#777}
        .summary strong{font-size:20px;margin-top:5px}
        table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left;font-size:12px}
        .positive{color:#11875d}.negative{color:#c03955}
        @media print{button{display:none}body{padding:0}}
      </style></head><body>
      <h1>Nosso Controle</h1>
      <p class="muted">Relatório gerado em ${new Date().toLocaleString("pt-BR")}</p>
      <section class="summary">
        <div><span>Receitas</span><strong>${moneySafe(income)}</strong></div>
        <div><span>Saídas</span><strong>${moneySafe(out)}</strong></div>
        <div><span>Saldo</span><strong>${moneySafe(income-out)}</strong></div>
      </section>
      <table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <script>setTimeout(()=>window.print(),400)<\/script>
      </body></html>`);
    report.document.close();
  }

  function automaticLocalBackup(){
    if(!state)return;
    try{
      const snapshot={
        version:"1.3",
        savedAt:new Date().toISOString(),
        householdId,
        householdCode,
        state
      };
      localStorage.setItem("nosso-controle-auto-backup",JSON.stringify(snapshot));
      localStorage.setItem("nosso-controle-auto-backup-time",snapshot.savedAt);
    }catch{}
  }

  function exportJsonBackup(){
    if(!state)return;
    const data={
      app:"Nosso Controle",
      version:"1.3",
      exportedAt:new Date().toISOString(),
      householdCode,
      state
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=`nosso-controle-backup-${currentLocalDate()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    toast("Backup exportado");
  }

  function createReminderCenter(){
    if(get("remindersDialog"))return;

    const dialog=document.createElement("dialog");
    dialog.id="remindersDialog";
    dialog.className="reminders-dialog";
    dialog.innerHTML=`
      <section class="reminders-panel">
        <div class="insights-header">
          <div>
            <span class="calendar-overline">LEMBRETES</span>
            <h2>Próximas Bills</h2>
            <p>Alertas disponíveis enquanto o aplicativo estiver aberto.</p>
          </div>
          <button id="closeReminders" class="round-button" type="button">×</button>
        </div>
        <div id="remindersList" class="reminders-list"></div>
        <p class="reminder-note">
          Notificações com o aplicativo fechado exigirão Push Notifications em uma atualização futura.
        </p>
      </section>
    `;
    document.body.appendChild(dialog);
    get("closeReminders").onclick=()=>dialog.close();
  }

  function upcomingBills(){
    const today=new Date();today.setHours(0,0,0,0);
    return (state?.bills||[])
      .filter(x=>!x.completed)
      .map(bill=>{
        const due=new Date(`${bill.due}T12:00:00`);
        const days=Math.ceil((due-today)/86400000);
        return {...bill,days};
      })
      .sort((a,b)=>a.days-b.days);
  }

  function renderReminders(){
    createReminderCenter();
    const bills=upcomingBills();
    get("remindersList").innerHTML=bills.map(bill=>`
      <article class="reminder-item ${bill.days<0?"late":bill.days<=2?"urgent":""}">
        <span class="reminder-bill-icon">${billIcon(bill.name)}</span>
        <div>
          <strong>${escapeHTML(bill.name)}</strong>
          <small>
            ${bill.days<0?`Vencida há ${Math.abs(bill.days)} dias`:bill.days===0?"Vence hoje":bill.days===1?"Vence amanhã":`Vence em ${bill.days} dias`}
          </small>
        </div>
        <b>${moneySafe(bill.amount)}</b>
      </article>
    `).join("")||'<div class="empty-state">Nenhuma Bill ativa.</div>';
  }

  function showInAppReminderBadge(){
    const menu=get("menuButton");
    if(!menu||!state)return;
    const urgent=upcomingBills().filter(x=>x.days<=2).length;
    menu.classList.toggle("has-reminders",urgent>0);
    menu.dataset.reminders=String(urgent);
  }

  function upgradeSettings(){
    const menu=get("menuButton");
    if(!menu||menu.dataset.v13)return;
    menu.dataset.v13="1";

    menu.addEventListener("click",()=>{
      setTimeout(()=>{
        const sheet=get("settingsSheet");
        const content=sheet?.querySelector(".settings-sheet");
        if(!content)return;

        const controlGroups=[...content.querySelectorAll(".settings-group")];
        const appGroup=controlGroups.find(group=>group.textContent.includes("APLICATIVO"));

        if(appGroup&&!get("openInsights")){
          appGroup.insertAdjacentHTML("beforebegin",`
            <section class="settings-group">
              <div class="settings-group-title">
                <span>ANÁLISES</span>
                <small>Histórico e alertas</small>
              </div>
              <button id="openInsights" class="settings-row" type="button">
                <span class="settings-row-icon purple">⌕</span>
                <span class="settings-row-copy"><b>Histórico e pesquisa</b><small>Filtros, categorias, estatísticas e PDF</small></span>
                <span class="settings-chevron">›</span>
              </button>
              <button id="openReminders" class="settings-row" type="button">
                <span class="settings-row-icon amber">◉</span>
                <span class="settings-row-copy"><b>Lembretes de Bills</b><small>Veja contas próximas e vencidas</small></span>
                <span class="settings-chevron">›</span>
              </button>
              <button id="exportJsonBackup" class="settings-row" type="button">
                <span class="settings-row-icon blue">⇩</span>
                <span class="settings-row-copy"><b>Exportar backup</b><small>Cópia completa em JSON</small></span>
                <span class="settings-chevron">›</span>
              </button>
            </section>
          `);
        }

        const insights=get("openInsights");
        if(insights)insights.onclick=()=>{
          sheet.classList.add("hidden");
          createInsightsView();
          const month=new Date().toISOString().slice(0,7);
          if(get("insightsMonthFilter")&&!get("insightsMonthFilter").value)get("insightsMonthFilter").value=month;
          renderInsights();
          get("insightsDialog").showModal();
        };

        const reminders=get("openReminders");
        if(reminders)reminders.onclick=()=>{
          sheet.classList.add("hidden");
          renderReminders();
          get("remindersDialog").showModal();
        };

        const backup=get("exportJsonBackup");
        if(backup)backup.onclick=exportJsonBackup;
      },0);
    });
  }

  function customizeBillIcons(){
    document.querySelectorAll(".bill-card").forEach(card=>{
      const name=card.querySelector(".bill-name")?.textContent||"";
      const icon=card.querySelector(".bill-illustration");
      if(icon)icon.textContent=billIcon(name);
    });
  }

  function addVersionNotes(){
    const dialog=get("updatesDialog");
    if(!dialog)return;
    const panel=dialog.querySelector(".updates-panel");
    if(!panel||panel.querySelector(".v13-release-note"))return;

    const note=document.createElement("section");
    note.className="v12-release-note v13-release-note";
    note.innerHTML=`
      <span>VERSÃO 1.3 · INSTALADA</span>
      <h3>Histórico, datas e produtividade</h3>
      <ul>
        <li>Escolha de data em receitas, gastos, Cofre e novas Bills.</li>
        <li>Pesquisa global e filtros por tipo e mês.</li>
        <li>Histórico financeiro consolidado.</li>
        <li>Gastos por categoria com barras de comparação.</li>
        <li>Relatório pronto para imprimir ou salvar em PDF.</li>
        <li>Backup automático local e exportação JSON.</li>
        <li>Central de lembretes para Bills próximas e vencidas.</li>
        <li>Ícones automáticos para os principais tipos de Bills.</li>
        <li>Estatísticas e saldo filtrado.</li>
        <li>Transições e refinamentos premium.</li>
      </ul>
    `;

    const current=panel.querySelector(".current-version-card");
    if(current)current.insertAdjacentElement("afterend",note);
    else panel.prepend(note);

    panel.querySelectorAll(".version-orb").forEach(x=>x.textContent="1.3");
    const strong=panel.querySelector(".current-version-card strong");
    if(strong)strong.textContent="Nosso Controle 2.0.1";
  }

  function addStyles(){
    if(get("v13PremiumStyles"))return;
    const style=document.createElement("style");
    style.id="v13PremiumStyles";
    style.textContent=`
      .v13-date-input{color-scheme:dark}
      input[type="date"],input[type="month"]{font-variant-numeric:tabular-nums}

      .insights-dialog,.reminders-dialog{width:min(95vw,720px);max-height:92vh}
      .insights-panel,.reminders-panel{
        max-height:90vh;overflow:auto;padding:15px;border-radius:24px;color:var(--ink);
        background:radial-gradient(circle at 90% 0,rgba(139,92,246,.12),transparent 28%),#10121f;
        border:1px solid var(--line)
      }
      .insights-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      .insights-header h2{font-size:22px;margin:5px 0 3px}.insights-header p{margin:0;color:var(--muted);font-size:9px}

      .insights-search-card{margin-top:14px;padding:10px;border-radius:17px;background:#171927;border:1px solid var(--line)}
      .global-search{display:flex;align-items:center;gap:8px}
      .global-search>span{font-size:19px;color:var(--purple-2)}
      .global-search input{border:0!important;background:transparent!important;padding:7px!important;min-height:36px!important}
      .insights-filters{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px}

      .insights-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}
      .insights-kpis article{padding:10px;border-radius:14px;background:#171927;border:1px solid var(--line)}
      .insights-kpis span,.insights-kpis strong{display:block}.insights-kpis span{font-size:7px;color:var(--muted)}
      .insights-kpis strong{font-size:14px;margin-top:4px}.insights-kpis strong.negative{color:#ff8395}

      .category-analysis,.history-analysis{margin-top:10px;padding:12px;border-radius:17px;background:#171927;border:1px solid var(--line)}
      .insights-section-title{display:flex;justify-content:space-between;align-items:center;gap:8px}
      .insights-section-title span{font-size:7px;color:var(--purple-2);font-weight:900;letter-spacing:.8px}
      .insights-section-title h3{font-size:14px;margin:3px 0 0}
      .mini-action-button{padding:7px 10px;border-radius:10px;border:1px solid rgba(90,167,255,.17);background:rgba(90,167,255,.08);color:var(--blue);font-size:9px;font-weight:900}

      .category-bars{display:grid;gap:9px;margin-top:11px}
      .category-bar-row>div:first-child{display:flex;justify-content:space-between;gap:8px;font-size:9px}
      .category-bar-row strong{font-size:9px}.category-bar-track{height:6px;margin-top:5px;border-radius:999px;background:#272a3c;overflow:hidden}
      .category-bar-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#8b5cf6,#5aa7ff)}

      .global-history-list{display:grid;gap:6px;margin-top:10px}
      .global-history-item{display:flex;align-items:center;gap:9px;padding:9px;border-radius:13px;background:#121421;border:1px solid rgba(255,255,255,.05)}
      .history-type-icon{width:31px;height:31px;display:grid;place-items:center;border-radius:10px;flex:none;font-weight:900}
      .history-type-icon.income{color:var(--green);background:rgba(63,230,162,.1)}
      .history-type-icon.expense{color:#ff8ebd;background:rgba(240,109,173,.1)}
      .history-type-icon.vault{color:var(--blue);background:rgba(90,167,255,.1)}
      .history-type-icon.bill{color:var(--purple-2);background:rgba(139,92,246,.11)}
      .global-history-item>div{min-width:0;flex:1}.global-history-item strong,.global-history-item small{display:block}
      .global-history-item strong{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .global-history-item small{font-size:7px;color:var(--muted);margin-top:3px}
      .global-history-item>b{font-size:10px}.global-history-item>b.positive{color:var(--green)}.global-history-item>b.negative{color:#ff8ebd}

      .reminders-list{display:grid;gap:7px;margin-top:14px}
      .reminder-item{display:flex;align-items:center;gap:10px;padding:11px;border-radius:15px;background:#171927;border:1px solid var(--line)}
      .reminder-item.urgent{border-color:rgba(255,189,92,.18);background:rgba(255,189,92,.045)}
      .reminder-item.late{border-color:rgba(255,112,132,.2);background:rgba(255,112,132,.05)}
      .reminder-bill-icon{width:37px;height:37px;display:grid;place-items:center;border-radius:12px;background:rgba(139,92,246,.1);color:var(--purple-2);font-size:17px}
      .reminder-item>div{flex:1}.reminder-item strong,.reminder-item small{display:block}.reminder-item strong{font-size:11px}.reminder-item small{font-size:8px;color:var(--muted);margin-top:3px}
      .reminder-item>b{font-size:11px}.reminder-note{font-size:8px;color:var(--muted);line-height:1.45;margin:12px 2px 0;text-align:center}

      #menuButton.has-reminders{position:relative}
      #menuButton.has-reminders::after{content:attr(data-reminders);position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;padding:0 3px;display:grid;place-items:center;border-radius:999px;background:#ff6e86;color:#fff;font-size:7px;font-weight:900;border:2px solid #090a15}

      .bill-illustration{transition:transform .2s ease}.bill-card:active .bill-illustration{transform:scale(.9)}
      .settings-row,.bill-card,.overview-metric,.period-summary article{transition:transform .15s ease,border-color .15s ease}
      .settings-row:active,.bill-card:active,.overview-metric:active,.period-summary article:active{transform:scale(.985)}

      @media(max-width:520px){
        .insights-kpis{grid-template-columns:1fr 1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function install(){
    addStyles();
    ensureDateFields();
    ensureDateDefaults();
    createInsightsView();
    createReminderCenter();
    upgradeSettings();
    customizeBillIcons();
    addVersionNotes();
    automaticLocalBackup();
    showInAppReminderBadge();

    document.querySelectorAll(".updates-version-badge,.settings-version,.version-orb").forEach(el=>{
      if(/^1\./.test(el.textContent.trim()))el.textContent="1.3";
    });
  }

  install();
  window.addEventListener("pageshow",install);
  setInterval(()=>{
    if(state){
      automaticLocalBackup();
      showInAppReminderBadge();
      customizeBillIcons();
    }
  },60000);
  setTimeout(install,300);
  setTimeout(install,1200);
})();


/* =========================================================
   NOSSO CONTROLE 1.3.1
   Data opcional: vazio = hoje
   ========================================================= */
(function installOptionalDateFix(){
  const get=id=>document.getElementById(id);

  function today(){
    return currentLocalDate();
  }

  function prepareOptionalDateInput(id,labelText){
    const input=get(id);
    if(!input)return;

    input.type="date";
    input.removeAttribute("required");
    input.dataset.optionalDate="1";

    const label=input.closest("label");
    if(label){
      const textNode=[...label.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
      if(textNode)textNode.textContent=`${labelText} (opcional)`;
    }

    // Não preenche automaticamente: visualmente fica opcional.
    // Na hora de salvar, vazio será convertido para hoje.
    if(input.dataset.userSelected!=="1"){
      input.value="";
    }

    input.onchange=()=>{
      input.dataset.userSelected=input.value?"1":"0";
    };
  }

  function normalizeOptionalDatesBeforeSave(){
    const map=[
      ["incomeDate",today()],
      ["expenseDate",today()],
      ["vaultDate",today()],
      ["newBillDue",today()]
    ];

    map.forEach(([id,fallback])=>{
      const input=get(id);
      if(input&&!input.value)input.value=fallback;
    });
  }

  function clearOptionalDatesAfterDialogOpen(){
    const buttons=[
      ["openIncome","incomeDate"],
      ["openIncomeToday","incomeDate"],
      ["openExpense","expenseDate"],
      ["openVaultDeposit","vaultDate"],
      ["openNewBill","newBillDue"]
    ];

    buttons.forEach(([buttonId,inputId])=>{
      const button=get(buttonId);
      if(!button||button.dataset.optionalDateBound==="1")return;
      button.dataset.optionalDateBound="1";

      button.addEventListener("click",()=>{
        setTimeout(()=>{
          const input=get(inputId);
          if(!input)return;
          input.value="";
          input.dataset.userSelected="0";
        },0);
      });
    });
  }

  function bindSaveFallbacks(){
    const saveButtons=[
      "saveIncome",
      "saveExpense",
      "saveVaultDeposit",
      "saveNewBill"
    ];

    saveButtons.forEach(id=>{
      const button=get(id);
      if(!button||button.dataset.optionalDateSave==="1")return;
      button.dataset.optionalDateSave="1";

      // Capture roda antes dos handlers já existentes.
      button.addEventListener("click",normalizeOptionalDatesBeforeSave,{capture:true});
    });
  }

  function addDateHint(){
    const dialogs=[
      ["incomeDialog","incomeDate"],
      ["expenseDialog","expenseDate"],
      ["vaultDialog","vaultDate"],
      ["billCreateDialog","newBillDue"]
    ];

    dialogs.forEach(([dialogId,inputId])=>{
      const dialog=get(dialogId);
      const input=get(inputId);
      if(!dialog||!input)return;

      const label=input.closest("label");
      if(!label||label.querySelector(".optional-date-hint"))return;

      label.insertAdjacentHTML(
        "beforeend",
        '<small class="optional-date-hint">Se deixar vazio, será usada a data de hoje.</small>'
      );
    });
  }

  function updateReleaseNotes(){
    const dialog=get("updatesDialog");
    const panel=dialog?.querySelector(".updates-panel");
    if(!panel||panel.querySelector(".v131-release-note"))return;

    const note=document.createElement("section");
    note.className="v12-release-note v131-release-note";
    note.innerHTML=`
      <span>VERSÃO 1.3.1 · CORREÇÃO</span>
      <h3>Data opcional nos lançamentos</h3>
      <ul>
        <li>A data pode ficar vazia ao adicionar Receita, Gasto, Cofre ou Bill.</li>
        <li>Se nenhuma data for escolhida, o lançamento usa automaticamente a data de hoje.</li>
        <li>Se uma data for escolhida, o histórico e os gráficos respeitam essa data.</li>
      </ul>
    `;

    const current=panel.querySelector(".current-version-card");
    if(current)current.insertAdjacentElement("afterend",note);
    else panel.prepend(note);

    panel.querySelectorAll(".version-orb").forEach(el=>el.textContent="1.3.1");
    const versionName=panel.querySelector(".current-version-card strong");
    if(versionName)versionName.textContent="Nosso Controle 2.0.1";
  }

  function addStyles(){
    if(get("optionalDateStyles"))return;
    const style=document.createElement("style");
    style.id="optionalDateStyles";
    style.textContent=`
      .optional-date-hint{
        display:block;
        margin-top:5px;
        color:var(--muted);
        font-size:8px;
        line-height:1.35;
      }

      input[data-optional-date="1"]:not(:valid){
        color:var(--muted);
      }
    `;
    document.head.appendChild(style);
  }

  function install(){
    addStyles();

    prepareOptionalDateInput("incomeDate","Data da receita");
    prepareOptionalDateInput("expenseDate","Data do gasto");
    prepareOptionalDateInput("vaultDate","Data do depósito");
    prepareOptionalDateInput("newBillDue","Primeiro vencimento");

    clearOptionalDatesAfterDialogOpen();
    bindSaveFallbacks();
    addDateHint();
    updateReleaseNotes();

    document.querySelectorAll(".updates-version-badge,.settings-version,.version-orb").forEach(el=>{
      if(/^1\./.test(el.textContent.trim()))el.textContent="1.3.1";
    });
  }

  install();
  window.addEventListener("pageshow",install);
  setTimeout(install,300);
  setTimeout(install,1000);
})();


/* =========================================================
   NOSSO CONTROLE 1.4
   Datas nas Bills • resets seletivos • resumos mensais
   ========================================================= */
(function installV14(){
  const get=id=>document.getElementById(id);
  const today=()=>currentLocalDate();
  const monthKey=value=>{
    const key=typeof value==="string"&&value.length>=7?value.slice(0,7):today().slice(0,7);
    return key;
  };
  const monthLabel=key=>{
    const [y,m]=key.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"})
      .format(new Date(y,m-1,1,12));
  };
  const sum=list=>(list||[]).reduce((total,item)=>total+Number(item.amount||0),0);
  const safeClose=dialog=>{if(!dialog)return;try{dialog.close()}catch{dialog.removeAttribute("open")}};
  const safeOpen=dialog=>{if(!dialog)return;try{dialog.showModal()}catch{dialog.setAttribute("open","")}};

  function isoAtNoon(dateValue){
    const value=dateValue||today();
    return new Date(`${value}T12:00:00`).toISOString();
  }

  /* ---------- Data do depósito para Bills ---------- */
  function addDepositDate(){
    const dialog=get("depositDialog");
    const form=dialog?.querySelector("form");
    if(!form||get("billDepositDate"))return;

    const save=get("saveDeposit");
    const wrapper=document.createElement("label");
    wrapper.className="v14-date-label";
    wrapper.innerHTML=`
      Data do depósito <span>(opcional)</span>
      <input id="billDepositDate" type="date">
      <small>Se deixar vazio, será usada a data de hoje.</small>
    `;
    form.insertBefore(wrapper,save);

    const open=get("openDeposit");
    if(open&&!open.dataset.v14date){
      open.dataset.v14date="1";
      open.addEventListener("click",()=>{
        setTimeout(()=>{if(get("billDepositDate"))get("billDepositDate").value=""},0);
      });
    }

    if(save&&!save.dataset.v14date){
      save.dataset.v14date="1";
      save.addEventListener("click",()=>{
        const chosen=get("billDepositDate")?.value||today();
        window.__billDepositChosenDate=chosen;
      },{capture:true});
    }
  }

  /* Patch do histórico do depósito: troca a data recém-criada após salvar. */
  function normalizeLatestDepositDate(){
    const chosen=window.__billDepositChosenDate;
    if(!chosen||!state?.history?.length)return;
    const latest=[...state.history].reverse().find(item=>item.text==="Depósito adicionado");
    if(latest&&latest.__v14dated!==chosen){
      latest.date=isoAtNoon(chosen);
      latest.__v14dated=chosen;
    }
    window.__billDepositChosenDate=null;
  }

  /* ---------- Data ao pagar Bill ---------- */
  function ensureBillPaymentDialog(){
    if(get("billPaymentDateDialog"))return;

    const dialog=document.createElement("dialog");
    dialog.id="billPaymentDateDialog";
    dialog.innerHTML=`
      <form method="dialog" class="dialog-card compact-payment-dialog">
        <input id="billPaymentId" type="hidden">
        <div class="dialog-heading">
          <div>
            <span class="calendar-overline">PAGAR BILL</span>
            <h2 id="billPaymentTitle">Confirmar pagamento</h2>
            <p id="billPaymentSubtitle">Escolha a data ou deixe vazio para hoje.</p>
          </div>
          <button id="closeBillPaymentDialog" value="cancel" class="round-button">×</button>
        </div>
        <section class="payment-bill-summary">
          <span id="billPaymentIcon">£</span>
          <div><strong id="billPaymentName">Bill</strong><small id="billPaymentAmount">£0,00</small></div>
        </section>
        <label class="v14-date-label">
          Data do pagamento <span>(opcional)</span>
          <input id="billPaymentDate" type="date">
          <small>Vazio significa hoje.</small>
        </label>
        <button id="confirmBillPayment" value="cancel" class="primary-button">Confirmar pagamento</button>
      </form>
    `;
    document.body.appendChild(dialog);

    get("closeBillPaymentDialog").onclick=()=>safeClose(dialog);
    get("confirmBillPayment").onclick=async event=>{
      event.preventDefault();
      const id=get("billPaymentId").value;
      const paymentDate=get("billPaymentDate").value||today();
      safeClose(dialog);
      await executeBillPayment(id,paymentDate);
    };
  }

  const originalTogglePaid=typeof togglePaid==="function"?togglePaid:null;

  async function executeBillPayment(id,paymentDate){
    const bill=state.bills.find(x=>x.id===id);
    if(!bill)return;

    const oldReserved=Number(bill.reserved||0);
    const record=paymentRecordForBill(bill);
    record.date=isoAtNoon(paymentDate);
    record.paymentDate=paymentDate;
    state.history=state.history||[];
    state.history.push(record);

    let amountToRemove=oldReserved;
    const fromCash=Math.min(Number(state.cash||0),amountToRemove);
    state.cash=Math.max(0,Number(state.cash||0)-fromCash);
    amountToRemove-=fromCash;
    if(amountToRemove>0)state.card=Math.max(0,Number(state.card||0)-amountToRemove);

    if(bill.type==="installment"){
      if(Number(bill.currentInstallment)>=Number(bill.totalInstallments)){
        bill.completed=true;
        state.completedBills=state.completedBills||[];
        state.completedBills.push({
          ...structuredClone(bill),
          completedAt:isoAtNoon(paymentDate)
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
      state.completedBills=state.completedBills||[];
      state.completedBills.push({...structuredClone(bill),completedAt:isoAtNoon(paymentDate)});
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
  }

  window.togglePaid=function(id){
    ensureBillPaymentDialog();
    const bill=state?.bills?.find(x=>x.id===id);
    if(!bill)return;
    get("billPaymentId").value=id;
    get("billPaymentDate").value="";
    get("billPaymentName").textContent=bill.name;
    get("billPaymentAmount").textContent=money(Number(bill.amount||0));
    get("billPaymentIcon").textContent=typeof billIcon==="function"?billIcon(bill.name):"£";
    safeOpen(get("billPaymentDateDialog"));
  };

  /* ---------- Data explícita na criação/edição da Bill ---------- */
  function improveBillDate(){
    const input=get("newBillDue");
    if(!input)return;
    input.type="date";
    input.removeAttribute("required");
    const label=input.closest("label");
    if(label){
      const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
      if(node)node.textContent="Primeiro vencimento (opcional)";
      if(!label.querySelector(".v14-bill-date-hint")){
        label.insertAdjacentHTML("beforeend",'<small class="v14-bill-date-hint">Vazio significa hoje. Depois, a frequência avança esta data automaticamente.</small>');
      }
    }

    const save=get("saveNewBill");
    if(save&&!save.dataset.v14due){
      save.dataset.v14due="1";
      save.addEventListener("click",()=>{
        if(!input.value)input.value=today();
      },{capture:true});
    }
  }

  /* ---------- Resumos mensais ---------- */
  function availableMonths(){
    const keys=new Set([today().slice(0,7)]);
    (state?.incomes||[]).forEach(x=>x.date&&keys.add(monthKey(x.date)));
    (state?.expenses||[]).forEach(x=>x.date&&keys.add(monthKey(x.date)));
    (state?.vaultEntries||[]).forEach(x=>x.date&&keys.add(monthKey(x.date)));
    (state?.history||[]).forEach(x=>x.date&&keys.add(monthKey(dateKeyFromHistory(x.date))));
    return [...keys].sort().reverse();
  }

  function dateKeyFromHistory(value){
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return today();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function monthlySummary(key){
    const incomes=(state?.incomes||[]).filter(x=>monthKey(x.date)===key);
    const expenses=(state?.expenses||[]).filter(x=>monthKey(x.date)===key);
    const vault=(state?.vaultEntries||[]).filter(x=>monthKey(x.date)===key);
    const billPayments=(state?.history||[]).filter(x=>x.type==="bill_payment"&&monthKey(dateKeyFromHistory(x.date))===key);
    const billDeposits=(state?.history||[]).filter(x=>x.type!=="bill_payment"&&x.date&&monthKey(dateKeyFromHistory(x.date))===key)
      .reduce((total,x)=>total+Number(x.cash||0)+Number(x.card||0),0);

    const income=sum(incomes);
    const expense=sum(expenses);
    const vaultTotal=sum(vault);
    const bills=billPayments.reduce((total,x)=>total+Number(x.amount||0),0);
    return {
      key,income,expense,vault:vaultTotal,bills,billDeposits,
      balance:income-expense-bills-vaultTotal,
      count:incomes.length+expenses.length+vault.length+billPayments.length
    };
  }

  function ensureMonthlyDialog(){
    if(get("monthlySummariesDialog"))return;
    const dialog=document.createElement("dialog");
    dialog.id="monthlySummariesDialog";
    dialog.innerHTML=`
      <section class="monthly-panel">
        <div class="insights-header">
          <div>
            <span class="calendar-overline">FECHAMENTO MENSAL</span>
            <h2>Resumo por mês</h2>
            <p>Cada mês começa com seus próprios totais, sem apagar o histórico anterior.</p>
          </div>
          <button id="closeMonthlySummaries" class="round-button" type="button">×</button>
        </div>
        <div id="monthlySummaryList" class="monthly-summary-list"></div>
      </section>
    `;
    document.body.appendChild(dialog);
    get("closeMonthlySummaries").onclick=()=>safeClose(dialog);
  }

  function renderMonthlySummaries(){
    ensureMonthlyDialog();
    get("monthlySummaryList").innerHTML=availableMonths().map(key=>{
      const x=monthlySummary(key);
      const current=key===today().slice(0,7);
      return `
        <details class="monthly-summary-card" ${current?"open":""}>
          <summary>
            <div>
              <span>${current?"MÊS ATUAL":"MÊS ENCERRADO"}</span>
              <strong>${monthLabel(key)}</strong>
              <small>${x.count} movimentações</small>
            </div>
            <b class="${x.balance<0?"negative":"positive"}">${money(x.balance)}</b>
          </summary>
          <section class="monthly-summary-grid">
            <article><span>Receitas</span><strong>${money(x.income)}</strong></article>
            <article><span>Gastos</span><strong>${money(x.expense)}</strong></article>
            <article><span>Bills pagas</span><strong>${money(x.bills)}</strong></article>
            <article><span>Cofre</span><strong>${money(x.vault)}</strong></article>
            <article><span>Reservado nas Bills</span><strong>${money(x.billDeposits)}</strong></article>
            <article class="monthly-balance"><span>Saldo do mês</span><strong>${money(x.balance)}</strong></article>
          </section>
        </details>
      `;
    }).join("");
  }

  /* ---------- Reset seletivo ---------- */
  function resetCenterHTML(){
    return `
      <section class="selective-reset-card">
        <span class="calendar-overline">RESET SELETIVO</span>
        <h3>Escolha exatamente o que apagar</h3>
        <p>Nenhuma opção abaixo apaga todas as outras áreas automaticamente.</p>
        <div class="reset-option-list">
          <button data-reset-scope="reservations"><b>Reservas das Bills</b><small>Zera envelope, cartão e valores reservados.</small></button>
          <button data-reset-scope="income-month"><b>Receitas deste mês</b><small>Mantém receitas dos meses anteriores.</small></button>
          <button data-reset-scope="expenses-month"><b>Gastos deste mês</b><small>Mantém gastos dos meses anteriores.</small></button>
          <button data-reset-scope="vault-month"><b>Cofre deste mês</b><small>Mantém o histórico dos outros meses.</small></button>
          <button data-reset-scope="history-month"><b>Histórico de Bills deste mês</b><small>Remove depósitos e pagamentos do mês atual.</small></button>
          <button data-reset-scope="current-month"><b>Todo o mês atual</b><small>Receitas, gastos, Cofre e histórico apenas deste mês.</small></button>
          <button data-reset-scope="all-finance" class="danger"><b>Todos os dados financeiros</b><small>Mantém somente as Bills cadastradas.</small></button>
        </div>
      </section>
    `;
  }

  async function runSelectiveReset(scope){
    const current=today().slice(0,7);
    const descriptions={
      reservations:"reservas das Bills",
      "income-month":"receitas deste mês",
      "expenses-month":"gastos deste mês",
      "vault-month":"Cofre deste mês",
      "history-month":"histórico de Bills deste mês",
      "current-month":"todos os dados do mês atual",
      "all-finance":"todos os dados financeiros"
    };
    const phrase=scope==="all-finance"?"APAGAR":"RESETAR";
    const entered=prompt(`Para apagar ${descriptions[scope]}, digite ${phrase}`);
    if(entered!==phrase)return toast("Operação cancelada");

    if(scope==="reservations"){
      state.cash=0;state.card=0;
      (state.bills||[]).forEach(b=>b.reserved=0);
      state.history=(state.history||[]).filter(x=>x.type==="bill_payment");
    }
    if(scope==="income-month")state.incomes=(state.incomes||[]).filter(x=>monthKey(x.date)!==current);
    if(scope==="expenses-month")state.expenses=(state.expenses||[]).filter(x=>monthKey(x.date)!==current);
    if(scope==="vault-month")state.vaultEntries=(state.vaultEntries||[]).filter(x=>monthKey(x.date)!==current);
    if(scope==="history-month")state.history=(state.history||[]).filter(x=>monthKey(dateKeyFromHistory(x.date))!==current);
    if(scope==="current-month"){
      state.incomes=(state.incomes||[]).filter(x=>monthKey(x.date)!==current);
      state.expenses=(state.expenses||[]).filter(x=>monthKey(x.date)!==current);
      state.vaultEntries=(state.vaultEntries||[]).filter(x=>monthKey(x.date)!==current);
      state.history=(state.history||[]).filter(x=>monthKey(dateKeyFromHistory(x.date))!==current);
      state.cash=0;state.card=0;
      (state.bills||[]).forEach(b=>b.reserved=0);
    }
    if(scope==="all-finance"){
      state.incomes=[];state.expenses=[];state.vaultEntries=[];state.history=[];
      state.cash=0;state.card=0;
      (state.bills||[]).forEach(b=>b.reserved=0);
    }

    await persist(`${descriptions[scope]} apagados`);
  }

  function injectSettingsEntries(){
    const menu=get("menuButton");
    if(!menu||menu.dataset.v14settings)return;
    menu.dataset.v14settings="1";
    menu.addEventListener("click",()=>{
      setTimeout(()=>{
        const sheet=get("settingsSheet");
        const appGroup=[...sheet?.querySelectorAll(".settings-group")||[]]
          .find(x=>x.textContent.includes("APLICATIVO"));
        if(!appGroup)return;

        if(!get("openMonthlySummaries")){
          appGroup.insertAdjacentHTML("beforebegin",`
            <section class="settings-group">
              <div class="settings-group-title"><span>MESES</span><small>Histórico preservado</small></div>
              <button id="openMonthlySummaries" class="settings-row" type="button">
                <span class="settings-row-icon green">▦</span>
                <span class="settings-row-copy"><b>Resumos mensais</b><small>Veja cada mês encerrado e o mês atual</small></span>
                <span class="settings-chevron">›</span>
              </button>
              <button id="openSelectiveReset" class="settings-row" type="button">
                <span class="settings-row-icon amber">↺</span>
                <span class="settings-row-copy"><b>Reset seletivo</b><small>Apague apenas a área que escolher</small></span>
                <span class="settings-chevron">›</span>
              </button>
            </section>
          `);
        }

        get("openMonthlySummaries").onclick=()=>{
          sheet.classList.add("hidden");
          renderMonthlySummaries();
          safeOpen(get("monthlySummariesDialog"));
        };

        get("openSelectiveReset").onclick=()=>{
          sheet.classList.add("hidden");
          const dialog=get("updatesDialog");
          if(!dialog)return;
          const panel=dialog.querySelector(".updates-panel");
          let reset=panel.querySelector(".selective-reset-card");
          if(!reset){
            panel.insertAdjacentHTML("beforeend",resetCenterHTML());
            reset=panel.querySelector(".selective-reset-card");
            reset.querySelectorAll("[data-reset-scope]").forEach(button=>{
              button.onclick=()=>runSelectiveReset(button.dataset.resetScope);
            });
          }
          safeOpen(dialog);
          setTimeout(()=>reset.scrollIntoView({behavior:"smooth",block:"start"}),100);
        };
      },0);
    });
  }

  function monthRollover(){
    if(!state)return;
    const current=today().slice(0,7);
    if(state.lastActiveMonth&&state.lastActiveMonth!==current){
      toast(`Novo mês iniciado: ${monthLabel(current)}`);
    }
    state.lastActiveMonth=current;
  }

  function updateNotes(){
    const panel=get("updatesDialog")?.querySelector(".updates-panel");
    if(!panel||panel.querySelector(".v14-release-note"))return;
    const note=document.createElement("section");
    note.className="v12-release-note v14-release-note";
    note.innerHTML=`
      <span>VERSÃO 1.4 · INSTALADA</span>
      <h3>Bills com datas e fechamento mensal</h3>
      <ul>
        <li>Data opcional ao reservar dinheiro para Bills.</li>
        <li>Data opcional ao marcar uma Bill como paga.</li>
        <li>Primeiro vencimento selecionável em novas Bills.</li>
        <li>Reset separado por área, sem perder todo o processo.</li>
        <li>Resumo individual de cada mês anterior.</li>
        <li>Novo mês começa com totais mensais zerados, preservando o histórico.</li>
      </ul>
    `;
    const current=panel.querySelector(".current-version-card");
    if(current)current.insertAdjacentElement("afterend",note);
    panel.querySelectorAll(".version-orb").forEach(x=>x.textContent="1.4");
    const title=panel.querySelector(".current-version-card strong");
    if(title)title.textContent="Nosso Controle 2.0.1";
  }

  function addStyles(){
    if(get("v14Styles"))return;
    const style=document.createElement("style");
    style.id="v14Styles";
    style.textContent=`
      .v14-date-label span{color:var(--muted);font-size:8px}
      .v14-date-label small,.v14-bill-date-hint{display:block;color:var(--muted);font-size:8px;margin-top:5px;line-height:1.35}
      .compact-payment-dialog{max-width:420px}
      .payment-bill-summary{display:flex;align-items:center;gap:11px;padding:12px;margin:11px 0;border-radius:16px;background:#171927;border:1px solid var(--line)}
      .payment-bill-summary>span{width:40px;height:40px;display:grid;place-items:center;border-radius:13px;background:rgba(139,92,246,.12);color:var(--purple-2);font-size:19px}
      .payment-bill-summary strong,.payment-bill-summary small{display:block}.payment-bill-summary strong{font-size:13px}.payment-bill-summary small{font-size:10px;color:var(--muted);margin-top:3px}
      .monthly-panel{max-height:90vh;overflow:auto;padding:15px;border-radius:24px;background:#10121f;border:1px solid var(--line);color:var(--ink)}
      #monthlySummariesDialog{width:min(95vw,720px)}
      .monthly-summary-list{display:grid;gap:8px;margin-top:14px}
      .monthly-summary-card{border-radius:17px;background:#171927;border:1px solid var(--line);overflow:hidden}
      .monthly-summary-card summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px;cursor:pointer}
      .monthly-summary-card summary::-webkit-details-marker{display:none}
      .monthly-summary-card summary span,.monthly-summary-card summary strong,.monthly-summary-card summary small{display:block}
      .monthly-summary-card summary span{color:var(--purple-2);font-size:7px;font-weight:900;letter-spacing:.8px}
      .monthly-summary-card summary strong{font-size:14px;text-transform:capitalize;margin-top:3px}
      .monthly-summary-card summary small{color:var(--muted);font-size:8px;margin-top:3px}
      .monthly-summary-card summary>b{font-size:14px}.monthly-summary-card summary>b.positive{color:var(--green)}.monthly-summary-card summary>b.negative{color:#ff8395}
      .monthly-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 12px 12px}
      .monthly-summary-grid article{padding:10px;border-radius:13px;background:#11131f;border:1px solid rgba(255,255,255,.05)}
      .monthly-summary-grid span,.monthly-summary-grid strong{display:block}.monthly-summary-grid span{font-size:7px;color:var(--muted)}.monthly-summary-grid strong{font-size:13px;margin-top:4px}
      .monthly-summary-grid .monthly-balance{grid-column:1/-1;background:rgba(63,230,162,.05);border-color:rgba(63,230,162,.12)}
      .selective-reset-card{margin-top:13px;padding:13px;border-radius:17px;background:#171927;border:1px solid rgba(255,112,132,.12)}
      .selective-reset-card h3{font-size:14px;margin:5px 0 3px}.selective-reset-card>p{font-size:8px;color:var(--muted);margin:0 0 10px}
      .reset-option-list{display:grid;gap:6px}.reset-option-list button{text-align:left;padding:10px;border-radius:13px;border:1px solid var(--line);background:#11131f;color:var(--ink)}
      .reset-option-list b,.reset-option-list small{display:block}.reset-option-list b{font-size:10px}.reset-option-list small{font-size:8px;color:var(--muted);margin-top:3px}
      .reset-option-list button.danger{border-color:rgba(255,112,132,.18);background:rgba(255,112,132,.05);color:#ff899a}
    `;
    document.head.appendChild(style);
  }

  function install(){
    addStyles();
    addDepositDate();
    improveBillDate();
    ensureBillPaymentDialog();
    ensureMonthlyDialog();
    injectSettingsEntries();
    monthRollover();
    updateNotes();
    normalizeLatestDepositDate();

    document.querySelectorAll(".updates-version-badge,.settings-version,.version-orb").forEach(el=>{
      if(/^1\./.test(el.textContent.trim()))el.textContent="1.4";
    });
  }

  /* Depois de persistir um depósito, corrige sua data escolhida e sincroniza. */
  const originalPersistV14=typeof persist==="function"?persist:null;
  if(originalPersistV14&&!window.__persistWrappedV14){
    window.__persistWrappedV14=true;
    persist=async function(message){
      normalizeLatestDepositDate();
      monthRollover();
      return originalPersistV14(message);
    };
  }

  install();
  window.addEventListener("pageshow",install);
  setTimeout(install,300);
  setTimeout(install,1200);
})();


/* =========================================================
   NOSSO CONTROLE 2.0.1 -- REBUILD CLEAN
   Estrutura nova, Bills corrigidas e dashboard simplificado
   ========================================================= */
(function installV201Rebuild(){
  const $=id=>document.getElementById(id);
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const monthNow=()=>currentLocalDate().slice(0,7);
  const sum=list=>(list||[]).reduce((t,x)=>t+Number(x.amount||0),0);

  function monthlyData(){
    const month=monthNow();
    const incomes=(state?.incomes||[]).filter(x=>String(x.date||"").slice(0,7)===month);
    const expenses=(state?.expenses||[]).filter(x=>String(x.date||"").slice(0,7)===month);
    const vault=(state?.vaultEntries||[]).filter(x=>String(x.date||"").slice(0,7)===month);
    const bills=(state?.bills||[]).filter(x=>!x.completed);
    const reserved=bills.reduce((t,x)=>t+Number(x.reserved||0),0);
    const target=bills.reduce((t,x)=>t+Number(x.amount||0),0);
    const income=sum(incomes), expense=sum(expenses), protectedValue=sum(vault);
    return {
      income,expense,vault:protectedValue,reserved,target,
      free:income-expense-protectedValue-reserved
    };
  }

  function activeBillsSorted(){
    return (state?.bills||[])
      .filter(b=>!b.completed)
      .slice()
      .sort((a,b)=>new Date(a.due)-new Date(b.due));
  }

  function daysTo(date){
    const now=new Date(`${currentLocalDate()}T12:00:00`);
    const due=new Date(`${date}T12:00:00`);
    return Math.ceil((due-now)/86400000);
  }

  function smartNotice(){
    const bills=activeBillsSorted();
    const late=bills.find(x=>daysTo(x.due)<0);
    if(late){
      return {
        tone:"danger", eyebrow:"AÇÃO NECESSÁRIA",
        title:`${late.name} está vencida`,
        text:`Ainda faltam ${money(Math.max(0,Number(late.amount)-Number(late.reserved)))} para completar.`
      };
    }
    const next=bills[0];
    if(next&&daysTo(next.due)<=7){
      const d=daysTo(next.due);
      return {
        tone:"warning",eyebrow:"PRÓXIMA BILL",
        title:d===0?`${next.name} vence hoje`:`${next.name} vence em ${d} dia${d===1?"":"s"}`,
        text:`${money(Number(next.reserved))} reservados de ${money(Number(next.amount))}.`
      };
    }
    const data=monthlyData();
    return {
      tone:data.free>=0?"success":"danger",
      eyebrow:"MÊS ATUAL",
      title:data.income?`${money(Math.max(0,data.free))} livres no momento`:"Registre sua primeira receita",
      text:data.income?"Valores já descontando Bills, gastos e Cofre.":"O resumo será calculado automaticamente."
    };
  }

  function buildNewDashboard(){
    document.getElementById("v201Dashboard")?.remove();
  }

  function rebuildBillsCards(){
    const bills=activeBillsSorted();
    const cards=qsa("#billList .bill-card");
    cards.forEach((card,index)=>{
      const bill=bills[index];
      if(!bill)return;
      const reserved=Number(bill.reserved||0);
      const total=Number(bill.amount||0);
      const remaining=Math.max(0,total-reserved);
      const pct=total?Math.min(100,reserved/total*100):100;

      card.classList.add("v201-bill");
      const values=qs(".bill-values",card);
      if(values){
        values.innerHTML=`
          <div class="v201-bill-numbers">
            <strong>${money(reserved)} <span>de ${money(total)}</span></strong>
            <small>${remaining>0?`${money(remaining)} restantes`:"Totalmente reservada"}</small>
          </div>
        `;
      }
      const progress=qs(".bill-progress i",card);
      if(progress)progress.style.width=`${pct}%`;

      const edit=qs(".edit",card);
      const pay=qs(".pay",card);
      if(edit){edit.textContent="✎";edit.setAttribute("aria-label","Editar")}
      if(pay){pay.textContent="✓";pay.setAttribute("aria-label","Marcar paga")}
    });

    buildBillsSummary();
  }

  function buildBillsSummary(){
    document.getElementById("v201BillsSummary")?.remove();
  }

  function addBillFilters(){
    document.getElementById("v201BillFilters")?.remove();
  }

  function cleanBottomNav(){
    const map={GERAL:"●",BILLS:"▤",GASTOS:"−",COFRE:"◆"};
    qsa(".nav-item").forEach(item=>{
      const label=qs("b",item)?.textContent.trim().toUpperCase();
      const icon=qs("span",item);
      if(icon&&map[label])icon.textContent=map[label];
    });
  }

  function updateNotes(){
    const panel=$("updatesDialog")?.querySelector(".updates-panel");
    if(!panel||panel.querySelector(".v201-note"))return;
    const note=document.createElement("section");
    note.className="v12-release-note v201-note";
    note.innerHTML=`
      <span>VERSÃO 2.0.1 · REBUILD</span>
      <h3>Nova interface Clean Premium</h3>
      <ul>
        <li>Dashboard antigo substituído por uma estrutura nova.</li>
        <li>Saldo livre como informação principal.</li>
        <li>Alerta inteligente baseado nas Bills reais.</li>
        <li>Métricas reduzidas a Receitas, Bills, Gastos e Cofre.</li>
        <li>Ações rápidas e timeline de receitas.</li>
        <li>Bills corrigidas: valores lidos diretamente dos dados.</li>
        <li>Cards menores com reservado de total.</li>
        <li>Filtros rápidos na tela de Bills.</li>
        <li>Menu inferior simplificado.</li>
      </ul>
    `;
    const current=panel.querySelector(".current-version-card");
    if(current)current.insertAdjacentElement("afterend",note);
    panel.querySelectorAll(".version-orb").forEach(x=>x.textContent="2.0.1");
    const title=panel.querySelector(".current-version-card strong");
    if(title)title.textContent="Nosso Controle 2.0.1";
  }

  function addStyles(){
    if($("v201Styles"))return;
    const style=document.createElement("style");
    style.id="v201Styles";
    style.textContent=`
      /* Esconde de verdade o dashboard antigo */
      #overviewView>.premium-hero,
      #overviewView>.period-summary,
      #overviewView>.daily-flow-card,
      #overviewView>.net-balance-card,
      #overviewView>.overview-grid,
      #overviewView>.vault-overview-card,
      #overviewView>.allocation-card,
      #overviewView>.finance-chart-card,
      #overviewView>.finance-chart-grid{
        display:none!important;
      }

      .v201-dashboard{display:grid;gap:10px;margin-bottom:12px}
      .v201-notice{display:flex;gap:10px;align-items:flex-start;padding:12px;border-radius:17px;background:#131522;border:1px solid rgba(255,255,255,.065)}
      .v201-notice-dot{width:9px;height:9px;margin-top:4px;border-radius:50%;flex:none;background:#8b5cf6}
      .v201-notice.warning .v201-notice-dot{background:#ffc260;box-shadow:0 0 12px rgba(255,194,96,.35)}
      .v201-notice.danger .v201-notice-dot{background:#ff7084;box-shadow:0 0 12px rgba(255,112,132,.35)}
      .v201-notice.success .v201-notice-dot{background:#3fe6a2;box-shadow:0 0 12px rgba(63,230,162,.35)}
      .v201-notice small,.v201-notice strong,.v201-notice p{display:block}
      .v201-notice small{font-size:7px;font-weight:900;letter-spacing:1px;color:var(--muted)}
      .v201-notice strong{font-size:12px;margin-top:3px}
      .v201-notice p{font-size:8px;color:var(--muted);margin:3px 0 0;line-height:1.35}

      .v201-balance{padding:18px;border-radius:24px;background:linear-gradient(145deg,#5f35c8,#342173 62%,#164b50);border:1px solid rgba(190,170,255,.22)}
      .v201-balance-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      .v201-balance span{font-size:8px;font-weight:850;letter-spacing:1px;color:rgba(255,255,255,.67)}
      .v201-balance strong{display:block;font-size:39px;letter-spacing:-1.4px;margin-top:6px}
      .v201-balance p{font-size:9px;color:rgba(255,255,255,.65);margin:5px 0 0}
      .v201-ring{--pct:0;width:72px;height:72px;border-radius:50%;display:grid;place-items:center;align-content:center;background:radial-gradient(circle,#4a2d9b 56%,transparent 57%),conic-gradient(#fff calc(var(--pct)*1%),rgba(255,255,255,.18) 0)}
      .v201-ring b{font-size:15px}.v201-ring small{font-size:7px;margin-top:1px}
      .v201-allocation{height:6px;margin-top:16px;border-radius:999px;background:rgba(255,255,255,.17);overflow:hidden}.v201-allocation i{display:block;height:100%;border-radius:inherit;background:#fff}

      .v201-metrics{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .v201-metrics article{padding:13px;border-radius:17px;background:#131522;border:1px solid rgba(255,255,255,.065)}
      .v201-metrics span,.v201-metrics strong{display:block}.v201-metrics span{font-size:8px;color:var(--muted)}.v201-metrics strong{font-size:18px;margin-top:5px}
      .v201-metrics .income strong{color:#3fe6a2}.v201-metrics .bills strong{color:#a98bff}.v201-metrics .expense strong{color:#ff8cbb}.v201-metrics .vault strong{color:#65acff}

      .v201-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .v201-actions button{display:flex;align-items:center;gap:9px;padding:11px;border-radius:16px;border:1px solid rgba(255,255,255,.065);background:#131522;color:var(--ink);text-align:left}
      .v201-actions button>span{width:34px;height:34px;display:grid;place-items:center;border-radius:11px;background:rgba(139,92,246,.13);color:#b59cff;font-size:17px}
      .v201-actions strong,.v201-actions small{display:block}.v201-actions strong{font-size:10px}.v201-actions small{font-size:7px;color:var(--muted);margin-top:3px}

      .v201-timeline{padding:13px;border-radius:18px;background:#131522;border:1px solid rgba(255,255,255,.065)}
      .v201-section-title{display:flex;justify-content:space-between;align-items:flex-end}.v201-section-title span{font-size:7px;color:#a98bff;font-weight:900;letter-spacing:.9px}.v201-section-title h3{font-size:13px;margin:3px 0 0}.v201-section-title button{border:0;background:transparent;color:#a98bff;font-size:8px}
      #v201IncomeList{display:grid;gap:6px;margin-top:10px}#v201IncomeList article{display:flex;align-items:center;gap:9px;padding:8px;border-radius:12px;background:#0f111c}
      .v201-income-icon{width:29px;height:29px;display:grid;place-items:center;border-radius:9px;background:rgba(63,230,162,.1);color:#3fe6a2}
      #v201IncomeList article>div{flex:1}#v201IncomeList strong,#v201IncomeList small{display:block}#v201IncomeList strong{font-size:9px}#v201IncomeList small{font-size:7px;color:var(--muted);margin-top:2px}#v201IncomeList b{font-size:10px;color:#3fe6a2}.v201-empty{text-align:center;color:var(--muted);font-size:8px;padding:16px}

      .v201-bills-summary{margin-bottom:8px;padding:13px;border-radius:18px;background:#131522;border:1px solid rgba(255,255,255,.065)}
      .v201-bills-summary>div:first-child{display:flex;align-items:baseline;gap:7px}.v201-bills-summary span{font-size:7px;color:#a98bff;font-weight:900}.v201-bills-summary strong{font-size:17px}.v201-bills-summary small{font-size:8px;color:var(--muted)}
      .v201-bills-progress{height:6px;margin-top:9px;border-radius:999px;background:#272a3b;overflow:hidden}.v201-bills-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#8b5cf6,#5aa7ff)}.v201-bills-summary>b{display:block;font-size:8px;color:var(--muted);margin-top:6px}

      .v201-bill-filters{display:flex;gap:6px;overflow:auto;margin:0 0 8px;scrollbar-width:none}.v201-bill-filters::-webkit-scrollbar{display:none}.v201-bill-filters button{white-space:nowrap;padding:7px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.065);background:#131522;color:var(--muted);font-size:8px}.v201-bill-filters button.active{background:rgba(139,92,246,.17);color:#fff;border-color:rgba(139,92,246,.25)}

      .bill-card.v201-bill{padding:12px!important;border-radius:18px!important;min-height:0!important}
      .v201-bill .bill-main{align-items:center!important}.v201-bill .bill-illustration{width:48px!important;height:48px!important;border-radius:14px!important}.v201-bill .bill-name{font-size:13px!important}.v201-bill .bill-due{font-size:8px!important}.v201-bill .bill-frequency-badge{display:none!important}
      .v201-bill .bill-values{display:block!important;margin-top:7px!important}.v201-bill-numbers{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.v201-bill-numbers strong{font-size:10px!important;color:var(--ink)!important}.v201-bill-numbers strong span{font-weight:500;color:var(--muted)}.v201-bill-numbers small{font-size:7px!important;color:var(--muted)!important}
      .v201-bill .bill-actions{position:absolute!important;right:12px!important;top:57px!important;display:flex!important;gap:5px!important}.v201-bill{position:relative!important}.v201-bill .bill-actions button{width:38px!important;height:38px!important;padding:0!important;font-size:17px!important;border-radius:12px!important}
      .v201-bill .bill-progress{margin-top:8px!important}

      .bottom-nav{padding:6px!important;border-radius:22px!important}.nav-item{min-height:57px!important}.nav-item span{font-size:18px!important}.nav-item b{font-size:10px!important}

      /* Esconde cards antigos de receitas porque a timeline nova já os substitui */
      #overviewView .section-heading,
      #overviewView #incomeList{display:none!important}
    `;
    document.head.appendChild(style);
  }

  const originalRender=window.render;
  if(typeof originalRender==="function"&&!window.__v201RenderWrapped){
    window.__v201RenderWrapped=true;
    window.render=function(){
      originalRender();
      buildNewDashboard();
      rebuildBillsCards();
      addBillFilters();
      cleanBottomNav();
      updateNotes();
    };
  }

  function install(){
    addStyles();
    if(state){
      buildNewDashboard();
      rebuildBillsCards();
      addBillFilters();
    }
    cleanBottomNav();
    updateNotes();
    qsa(".updates-version-badge,.settings-version,.version-orb").forEach(el=>{
      if(/^\d/.test(el.textContent.trim()))el.textContent="2.0.1";
    });
  }

  install();
  window.addEventListener("pageshow",install);
  setTimeout(install,400);
  setTimeout(install,1300);
})();


/* =========================================================
   NOSSO CONTROLE 2.1 — CLEAN SYSTEM
   Camada final integrada à base estável 2.0.1
   ========================================================= */
(function installV21(){
  const $=id=>document.getElementById(id);
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const currentMonth=()=>currentLocalDate().slice(0,7);
  const sum=list=>(list||[]).reduce((t,x)=>t+Number(x.amount||0),0);
  const openDialog=d=>{if(!d)return;try{d.showModal()}catch{d.setAttribute('open','')}};

  function monthState(){
    const key=currentMonth();
    const incomes=(state?.incomes||[]).filter(x=>String(x.date||'').slice(0,7)===key);
    const expenses=(state?.expenses||[]).filter(x=>String(x.date||'').slice(0,7)===key);
    const vault=(state?.vaultEntries||[]).filter(x=>String(x.date||'').slice(0,7)===key);
    const bills=(state?.bills||[]).filter(x=>!x.completed);
    const income=sum(incomes), expense=sum(expenses), saved=sum(vault);
    const reserved=bills.reduce((t,b)=>t+Number(b.reserved||0),0);
    const target=bills.reduce((t,b)=>t+Number(b.amount||0),0);
    return {incomes,expenses,vault,bills,income,expense,saved,reserved,target,free:income-expense-saved-reserved};
  }

  function daysUntilSafe(date){
    const a=new Date(`${currentLocalDate()}T12:00:00`);
    const b=new Date(`${date}T12:00:00`);
    return Math.ceil((b-a)/86400000);
  }

  function insight(data){
    const sorted=data.bills.slice().sort((a,b)=>new Date(a.due)-new Date(b.due));
    const overdue=sorted.find(b=>daysUntilSafe(b.due)<0);
    if(overdue){
      return {tone:'danger',label:'AÇÃO NECESSÁRIA',title:`${overdue.name} está vencida`,text:`Faltam ${money(Math.max(0,overdue.amount-overdue.reserved))} para completar.`};
    }
    const next=sorted[0];
    if(next&&daysUntilSafe(next.due)<=5){
      const d=daysUntilSafe(next.due);
      return {tone:'warning',label:'PRÓXIMA CONTA',title:d===0?`${next.name} vence hoje`:`${next.name} vence em ${d} dia${d===1?'':'s'}`,text:`${money(next.reserved)} reservados de ${money(next.amount)}.`};
    }
    if(data.income===0)return {tone:'neutral',label:'COMECE O MÊS',title:'Registre sua primeira receita',text:'O saldo livre será calculado automaticamente.'};
    return {tone:data.free>=0?'success':'danger',label:'MÊS ATUAL',title:`${money(Math.max(0,data.free))} livres`,text:'Depois de Bills, gastos e Cofre.'};
  }

  function renderDashboardV21(){
    if(!state)return;
    const view=$('overviewView'); if(!view)return;
    let root=$('v21Dashboard');
    if(!root){root=document.createElement('div');root.id='v21Dashboard';root.className='v21-dashboard';view.prepend(root)}
    const d=monthState(), tip=insight(d);
    const freePct=d.income?Math.max(0,Math.min(100,d.free/d.income*100)):0;
    const recent=d.incomes.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
    root.innerHTML=`
      <section class="v21-insight ${tip.tone}"><i></i><div><small>${tip.label}</small><strong>${tip.title}</strong><p>${tip.text}</p></div></section>
      <section class="v21-hero">
        <div><span>SALDO LIVRE DO MÊS</span><strong>${money(d.free)}</strong><p>Já descontando tudo que foi separado.</p></div>
        <div class="v21-score" style="--score:${freePct}"><b>${freePct.toFixed(0)}%</b><small>livre</small></div>
        <div class="v21-hero-row"><span>Recebido <b>${money(d.income)}</b></span><span>Comprometido <b>${money(d.reserved+d.expense)}</b></span><span>Protegido <b>${money(d.saved)}</b></span></div>
      </section>
      <section class="v21-grid">
        <article class="income"><span>Receitas</span><strong>${money(d.income)}</strong></article>
        <article class="bills"><span>Bills</span><strong>${money(d.reserved)}</strong></article>
        <article class="expense"><span>Gastos</span><strong>${money(d.expense)}</strong></article>
        <article class="vault"><span>Cofre</span><strong>${money(d.saved)}</strong></article>
      </section>
      <section class="v21-actions">
        <button id="v21Income"><span>＋</span><div><b>Adicionar receita</b><small>Nova entrada</small></div></button>
        <button id="v21Stats"><span>⌁</span><div><b>Estatísticas</b><small>Histórico e PDF</small></div></button>
      </section>
      <section class="v21-recent">
        <header><div><small>ATIVIDADE</small><h3>Receitas recentes</h3></div><button id="v21AllIncome">Ver todas</button></header>
        <div>${recent.length?recent.map(x=>`<article><i>↗</i><div><b>${x.description||'Receita'}</b><small>${new Date(`${x.date}T12:00:00`).toLocaleDateString('pt-BR')}</small></div><strong>+${money(Number(x.amount||0))}</strong></article>`).join(''):'<p class="v21-empty">Nenhuma receita neste mês.</p>'}</div>
      </section>`;
    $('v21Income').onclick=()=>$('openIncome')?.click();
    $('v21Stats').onclick=()=>{if(typeof renderInsights==='function')renderInsights();openDialog($('insightsDialog'))};
    $('v21AllIncome').onclick=()=>{qs('#incomeList')?.scrollIntoView({behavior:'smooth'})};
  }

  function billIcon(name){
    const n=String(name||'').toLowerCase();
    if(n.includes('energia')||n.includes('edf'))return '⚡';
    if(n.includes('alug'))return '⌂';
    if(n.includes('água')||n.includes('agua'))return '◉';
    if(n.includes('carro')||n.includes('seguro'))return '🚘';
    if(n.includes('council'))return '▦';
    if(n.includes('internet')||n.includes('bt'))return '⌁';
    return '£';
  }

  function renderBillsV21(){
    if(!state)return;
    const list=$('billList'); if(!list)return;
    const bills=state.bills.filter(b=>!b.completed).slice().sort((a,b)=>new Date(a.due)-new Date(b.due));
    list.innerHTML='';
    bills.forEach(b=>{
      const remain=Math.max(0,b.amount-b.reserved), pct=b.amount?Math.min(100,b.reserved/b.amount*100):100, days=daysUntilSafe(b.due);
      const card=document.createElement('article'); card.className='v21-bill-card'; card.dataset.billId=b.id; card.dataset.days=days; card.dataset.ready=String(remain===0);
      card.innerHTML=`
        <div class="v21-bill-top"><span class="v21-bill-icon">${billIcon(b.name)}</span><div><strong>${b.name}</strong><small>${formatDate(b.due)} · ${frequencyLabel(b.frequency)}</small></div><em class="${days<0?'danger':days<=7?'warning':''}">${days<0?`${Math.abs(days)}d atrasada`:days===0?'Hoje':`${days}d`}</em></div>
        <div class="v21-bill-progress"><i style="width:${pct}%"></i></div>
        <div class="v21-bill-bottom"><div><strong>${money(b.reserved)} <span>/ ${money(b.amount)}</span></strong><small>${remain?`${money(remain)} restantes`:'Totalmente reservada'}</small></div><div class="v21-bill-actions"><button data-action="edit">✎</button><button data-action="pay">✓</button></div></div>
        ${b.type==='installment'?`<div class="v21-installment"><span>Parcela ${b.currentInstallment}/${b.totalInstallments}</span><i><b style="width:${Math.min(100,b.currentInstallment/b.totalInstallments*100)}%"></b></i></div>`:''}`;
      card.onclick=e=>{const btn=e.target.closest('button');if(!btn)return;btn.dataset.action==='edit'?openBillCreateDialog(b.id):togglePaid(b.id)};
      list.appendChild(card);
    });
    renderBillSummaryV21(bills);
  }

  function renderBillSummaryV21(bills){
    const view=$('billsView'), list=$('billList'); if(!view||!list)return;
    let summary=$('v21BillSummary'); if(!summary){summary=document.createElement('section');summary.id='v21BillSummary';summary.className='v21-bill-summary';list.before(summary)}
    const total=bills.reduce((t,b)=>t+b.amount,0), reserved=bills.reduce((t,b)=>t+b.reserved,0), pct=total?Math.min(100,reserved/total*100):0;
    summary.innerHTML=`<div><small>BILLS ATIVAS</small><strong>${bills.length} contas</strong><span>${money(total)} no total</span></div><div class="v21-summary-track"><i style="width:${pct}%"></i></div><b>${pct.toFixed(0)}% reservado</b>`;
    let filters=$('v21BillFilters'); if(!filters){filters=document.createElement('div');filters.id='v21BillFilters';filters.className='v21-filters';filters.innerHTML='<button class="active" data-f="all">Todas</button><button data-f="late">Atrasadas</button><button data-f="week">7 dias</button><button data-f="ready">Reservadas</button>';summary.after(filters);filters.onclick=e=>{const b=e.target.closest('button');if(!b)return;qsa('button',filters).forEach(x=>x.classList.toggle('active',x===b));qsa('.v21-bill-card').forEach(c=>{const d=Number(c.dataset.days),ready=c.dataset.ready==='true';let show=true;if(b.dataset.f==='late')show=d<0;if(b.dataset.f==='week')show=d>=0&&d<=7;if(b.dataset.f==='ready')show=ready;c.hidden=!show})}};
  }

  function cleanSettings(){
    const sheet=$('settingsSheet'); if(!sheet)return;
    sheet.classList.add('v21-settings');
    const title=qs('.sheet-title h2',sheet); if(title)title.textContent='Configurações';
    qsa('.sheet-action',sheet).forEach(btn=>btn.classList.add('v21-setting-row'));
    const version=qs('.updates-version-badge',sheet); if(version)version.textContent='2.1.1';
  }

  function updateNotes(){
    const panel=$('updatesDialog')?.querySelector('.updates-panel'); if(!panel||qs('.v21-note',panel))return;
    const note=document.createElement('section');note.className='v12-release-note v21-note';note.innerHTML='<span>VERSÃO 2.1.3 · INSTALADA</span><h3>Clean System</h3><ul><li>Dashboard reconstruído e mais enxuto.</li><li>Saldo livre como informação principal.</li><li>Alerta inteligente de prioridade.</li><li>Bills totalmente redesenhadas e compactas.</li><li>Filtros rápidos para Bills.</li><li>Configurações mais limpas.</li><li>Sessão persistente no iPhone.</li><li>Service Worker atualizado para evitar cache antigo.</li></ul>';
    const current=qs('.current-version-card',panel); if(current)current.after(note);
    qsa('.version-orb',panel).forEach(x=>x.textContent='2.1.1'); const t=qs('.current-version-card strong',panel);if(t)t.textContent='Nosso Controle 2.1.3';
  }

  const oldRender=window.render;
  if(typeof oldRender==='function'&&!window.__v21Wrapped){window.__v21Wrapped=true;window.render=function(){oldRender();renderDashboardV21();renderBillsV21();cleanSettings();updateNotes()}}

  function install(){
    if(state){renderDashboardV21();renderBillsV21()}
    cleanSettings();updateNotes();
    qsa('.updates-version-badge,.settings-version,.version-orb').forEach(x=>{if(/^\d/.test(x.textContent.trim()))x.textContent='2.1.1'});
  }
  install();window.addEventListener('pageshow',install);setTimeout(install,400);setTimeout(install,1200);
})();


/* =========================================================
   NOSSO CONTROLE 2.1.1 — zoom + filtros + username
   ========================================================= */
(function installV211Fixes(){
  let activeBillFilter="all";

  function applyActiveBillFilter(){
    const buttons=[...document.querySelectorAll("#v21BillFilters button")];
    buttons.forEach(button=>button.classList.toggle("active",button.dataset.f===activeBillFilter));
    document.querySelectorAll(".v21-bill-card").forEach(card=>{
      const days=Number(card.dataset.days);
      const ready=card.dataset.ready==="true";
      let visible=true;
      if(activeBillFilter==="late")visible=days<0;
      if(activeBillFilter==="week")visible=days>=0&&days<=7;
      if(activeBillFilter==="ready")visible=ready;
      card.hidden=!visible;
      card.style.display=visible?"":"none";
    });
  }

  document.addEventListener("click",event=>{
    const button=event.target.closest("#v21BillFilters button");
    if(button){
      activeBillFilter=button.dataset.f||"all";
      requestAnimationFrame(applyActiveBillFilter);
      return;
    }

    const saveButton=event.target.closest("#saveIncome,#saveExpense,#saveDeposit,#saveVaultDeposit,#saveNewBill,#confirmBillPayment,#loginBtn,#signupBtn");
    if(saveButton){
      const y=window.scrollY;
      setTimeout(()=>{
        closeKeyboardAndResetViewport(saveButton.id==="loginBtn");
        if(saveButton.id!=="loginBtn")window.scrollTo({top:y,left:0,behavior:"instant"});
      },60);
    }
  },true);

  const billList=document.getElementById("billList");
  if(billList){
    const observer=new MutationObserver(()=>requestAnimationFrame(applyActiveBillFilter));
    observer.observe(billList,{childList:true,subtree:false});
  }

  window.addEventListener("pageshow",()=>{
    restoreUsernameField();
    closeKeyboardAndResetViewport(document.getElementById("appView")&&!document.getElementById("appView").classList.contains("hidden"));
    requestAnimationFrame(applyActiveBillFilter);
  });

  window.visualViewport?.addEventListener("resize",()=>{
    if(document.activeElement===document.body||!document.activeElement)window.scrollTo({left:0,top:window.scrollY,behavior:"instant"});
  });

  const notes=document.querySelector("#updatesDialog .updates-panel");
  if(notes&&!notes.querySelector(".v211-note")){
    const note=document.createElement("section");
    note.className="v12-release-note v211-note";
    note.innerHTML='<span>VERSÃO 2.1.1 · CORREÇÕES</span><h3>Estabilidade no iPhone</h3><ul><li>Zoom automático eliminado ao entrar e salvar lançamentos.</li><li>Layout ajustado para o iPhone 17 Pro Max.</li><li>Teclado e foco fechados corretamente após as ações.</li><li>Filtros das Bills corrigidos e preservados após atualizar a lista.</li><li>Login simplificado para Username e senha.</li><li>Sessão persistente mantida neste aparelho.</li></ul>';
    const current=notes.querySelector(".current-version-card");
    if(current)current.after(note);else notes.prepend(note);
  }

  restoreUsernameField();
  requestAnimationFrame(applyActiveBillFilter);
})();

/* =========================================================
   NOSSO CONTROLE 2.1.3 — correção segura de Bills duplicadas
   Mantém integralmente o layout estável da versão 2.1.1.
   ========================================================= */
(function installV213SafeBillsCleanup(){
  function cleanupBillsDuplicates(){
    document.getElementById("v201BillsSummary")?.remove();
    document.getElementById("v201BillFilters")?.remove();

    ["v21BillSummary","v21BillFilters"].forEach(id=>{
      const nodes=[...document.querySelectorAll(`#${id}`)];
      nodes.slice(1).forEach(node=>node.remove());
    });
  }

  function updateV213Notes(){
    const panel=document.getElementById("updatesDialog")?.querySelector(".updates-panel");
    if(!panel||panel.querySelector(".v213-note"))return;

    const note=document.createElement("section");
    note.className="v12-release-note v213-note";
    note.innerHTML=`
      <span>VERSÃO 2.1.3 · CORREÇÃO SEGURA</span>
      <h3>Layout 2.1.1 restaurado</h3>
      <ul>
        <li>Restaurada integralmente a organização visual da versão 2.1.1.</li>
        <li>Removido apenas o resumo antigo duplicado da tela de Bills.</li>
        <li>Removidos apenas os filtros antigos duplicados.</li>
        <li>Configurações e demais telas não são mais observadas ou modificadas pela correção.</li>
      </ul>
    `;

    const current=panel.querySelector(".current-version-card");
    if(current)current.insertAdjacentElement("afterend",note);
    panel.querySelectorAll(".version-orb").forEach(el=>el.textContent="2.1.3");
    const title=panel.querySelector(".current-version-card strong");
    if(title)title.textContent="Nosso Controle 2.1.3";
  }

  const previousRender=window.render;
  if(typeof previousRender==="function"&&!window.__v213RenderWrapped){
    window.__v213RenderWrapped=true;
    window.render=function(...args){
      const result=previousRender.apply(this,args);
      requestAnimationFrame(cleanupBillsDuplicates);
      setTimeout(cleanupBillsDuplicates,80);
      return result;
    };
  }

  function install(){
    cleanupBillsDuplicates();
    updateV213Notes();
    document.querySelectorAll(".updates-version-badge,.settings-version,.version-orb").forEach(el=>{
      if(/^\d/.test(el.textContent.trim()))el.textContent="2.1.3";
    });
  }

  install();
  window.addEventListener("pageshow",install,{once:false});
  setTimeout(install,250);
  setTimeout(cleanupBillsDuplicates,900);
})();

/* =========================================================
   NOSSO CONTROLE 2.1.4 — username migration + update stability
   ========================================================= */
(function installV214AuthAndUpdateFix(){
  const field=document.getElementById('email');
  const password=document.getElementById('password');
  const login=document.getElementById('loginBtn');
  const signup=document.getElementById('signupBtn');
  const feedbackEl=document.getElementById('authMsg');
  if(!field||!password||!login||!signup)return;

  const normalize=value=>String(value||'').trim().toLowerCase().replace(/[^a-z0-9._-]/g,'');
  const setMessage=text=>{if(feedbackEl)feedbackEl.textContent=text||''};
  const remember=(username,email)=>{
    const clean=normalize(username);
    if(!clean||!email)return;
    localStorage.setItem('nosso-controle-username',clean);
    localStorage.setItem('nosso-controle-email',email);
    localStorage.setItem(`nosso-controle-username-email:${clean}`,email);
  };
  const mappedEmail=username=>{
    const clean=normalize(username);
    return localStorage.getItem(`nosso-controle-username-email:${clean}`)||'';
  };

  function ensureUsernameDialog(){
    let dialog=document.getElementById('usernameSetupDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='usernameSetupDialog';
    dialog.innerHTML=`
      <form method="dialog" class="dialog-card username-setup-card">
        <div class="dialog-heading">
          <div><span class="calendar-overline">CONFIGURAR ACESSO</span><h2>Crie seu Username</h2><p>Você usará este nome nos próximos acessos neste iPhone.</p></div>
        </div>
        <label>Username<input id="newUsernameValue" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ex.: lucas"></label>
        <small class="username-setup-help">Use pelo menos 3 caracteres: letras, números, ponto, hífen ou underline.</small>
        <div id="usernameSetupMsg" class="feedback"></div>
        <button id="saveUsernameSetup" value="cancel" class="primary-button">Salvar Username</button>
        <button id="skipUsernameSetup" value="cancel" class="secondary-button">Agora não</button>
      </form>`;
    document.body.appendChild(dialog);
    document.getElementById('skipUsernameSetup').onclick=()=>{try{dialog.close()}catch{dialog.removeAttribute('open')}};
    document.getElementById('saveUsernameSetup').onclick=async event=>{
      event.preventDefault();
      const input=document.getElementById('newUsernameValue');
      const clean=normalize(input.value);
      const msg=document.getElementById('usernameSetupMsg');
      if(clean.length<3){msg.textContent='Use um Username com pelo menos 3 caracteres.';return}
      const {data:{session}}=await sb.auth.getSession();
      const email=session?.user?.email;
      if(!email){msg.textContent='Sua sessão expirou. Entre novamente.';return}
      remember(clean,email);
      await sb.auth.updateUser({data:{username:clean}}).catch(()=>{});
      field.value=clean;
      try{dialog.close()}catch{dialog.removeAttribute('open')}
      toast('Username cadastrado');
    };
    return dialog;
  }

  async function offerUsernameForLegacyAccount(session,typedValue){
    if(!session?.user)return;
    const metadataUsername=normalize(session.user.user_metadata?.username);
    if(metadataUsername){remember(metadataUsername,session.user.email);return}
    const saved=normalize(localStorage.getItem('nosso-controle-username'));
    if(saved){remember(saved,session.user.email);return}
    if(!String(typedValue).includes('@'))return;
    const dialog=ensureUsernameDialog();
    const suggested=normalize(String(session.user.email||'').split('@')[0]);
    document.getElementById('newUsernameValue').value=suggested;
    try{dialog.showModal()}catch{dialog.setAttribute('open','')}
  }

  login.onclick=async()=>{
    setMessage('');
    const entered=String(field.value||'').trim().toLowerCase();
    if(!entered)return setMessage('Digite seu Username ou e-mail.');
    let email;
    if(entered.includes('@')){
      email=entered;
    }else{
      email=mappedEmail(entered);
      if(!email){
        return setMessage('Este Username ainda não está ligado a uma conta neste iPhone. Entre uma vez com seu e-mail para cadastrá-lo.');
      }
    }
    const {data,error}=await sb.auth.signInWithPassword({email,password:password.value});
    if(error)return setMessage('Username, e-mail ou senha incorretos.');
    const session=data?.session;
    if(!entered.includes('@'))remember(entered,email);
    user=session.user;
    closeKeyboardAndResetViewport(true);
    await loadMembership();
    await offerUsernameForLegacyAccount(session,entered);
  };

  signup.onclick=async()=>{
    setMessage('');
    const entered=String(field.value||'').trim().toLowerCase();
    if(entered.includes('@'))return setMessage('Para criar uma conta nova, escolha um Username sem @.');
    const username=normalize(entered);
    if(username.length<3)return setMessage('Use um Username com pelo menos 3 caracteres.');
    const email=`${username}@nosso-controle.app`;
    const {error}=await sb.auth.signUp({email,password:password.value,options:{data:{username}}});
    if(error)return setMessage(error.message);
    remember(username,email);
    setMessage('Conta criada. Agora toque em Entrar.');
  };

  sb.auth.getSession().then(({data})=>{
    const session=data?.session;
    if(!session?.user)return;
    const username=normalize(session.user.user_metadata?.username)||normalize(localStorage.getItem('nosso-controle-username'));
    if(username){remember(username,session.user.email);field.value=username}
  }).catch(()=>{});

  const panel=document.querySelector('#updatesDialog .updates-panel');
  if(panel&&!panel.querySelector('.v214-note')){
    const note=document.createElement('section');
    note.className='v12-release-note v214-note';
    note.innerHTML='<span>VERSÃO 2.1.4 · ACESSO E ATUALIZAÇÕES</span><h3>Username e cache corrigidos</h3><ul><li>Contas antigas podem entrar uma vez com o e-mail e cadastrar um Username.</li><li>O login aceita Username ou e-mail durante a migração.</li><li>Contas novas continuam sendo criadas diretamente com Username.</li><li>Todos os arquivos agora usam a mesma versão 2.1.4.</li><li>Service Worker atualizado sem reutilizar arquivos antigos.</li><li>O app recarrega uma única vez quando uma versão nova assumir o controle.</li></ul>';
    const current=panel.querySelector('.current-version-card');
    if(current)current.after(note);else panel.prepend(note);
  }
  document.querySelectorAll('.updates-version-badge,.settings-version,.version-orb').forEach(el=>{
    if(/^\d/.test(el.textContent.trim()))el.textContent='2.1.4';
  });
})();


/* =========================================================
   NOSSO CONTROLE 2.1.6 — CORREÇÃO DE ABERTURA AUTOMÁTICA
   ========================================================= */
(function installV215DialogStartupFix(){
  const closeUpdatesDialog=()=>{
    const dialog=document.getElementById('updatesDialog');
    if(!dialog)return;
    try{
      if(dialog.open)dialog.close();
    }catch{}
    dialog.removeAttribute('open');
    dialog.classList.remove('force-open','is-open','visible','active');
    document.documentElement.classList.remove('dialog-open','modal-open');
    document.body?.classList.remove('dialog-open','modal-open','no-scroll');
  };

  // Safari pode restaurar um <dialog> aberto ao voltar, atualizar ou reabrir a aba.
  // Fechamos em todos os ciclos de inicialização e permitimos abertura apenas pelo botão.
  closeUpdatesDialog();
  document.addEventListener('DOMContentLoaded',closeUpdatesDialog,{once:true});
  window.addEventListener('pageshow',()=>{
    closeUpdatesDialog();
    requestAnimationFrame(closeUpdatesDialog);
    setTimeout(closeUpdatesDialog,120);
  });

  const bindOpenButton=()=>{
    const button=document.getElementById('openUpdatesPanel');
    const dialog=document.getElementById('updatesDialog');
    if(!button||!dialog||button.dataset.v215Bound==='1')return;
    button.dataset.v215Bound='1';
    button.onclick=event=>{
      event.preventDefault();
      event.stopPropagation();
      try{dialog.showModal()}catch{dialog.setAttribute('open','')}
    };
  };

  const updateVersionCard=()=>{
    const dialog=document.getElementById('updatesDialog');
    if(!dialog)return;
    dialog.querySelectorAll('.version-orb,.updates-version-badge,.settings-version').forEach(el=>el.textContent='2.1.5');
    const title=dialog.querySelector('.current-version-card strong');
    const caption=dialog.querySelector('.current-version-card small');
    if(title)title.textContent='Nosso Controle 2.1.5';
    if(caption)caption.textContent='Correção da abertura automática da tela de Atualizações';

    const panel=dialog.querySelector('.updates-panel');
    if(panel&&!panel.querySelector('.v215-note')){
      const note=document.createElement('section');
      note.className='v12-release-note v215-note';
      note.innerHTML='<span>VERSÃO 2.1.5 · CORREÇÃO</span><h3>Inicialização corrigida</h3><ul><li>A tela de Atualizações não abre mais sozinha.</li><li>O estado antigo do diálogo é removido ao iniciar ou restaurar a página no Safari.</li><li>A tela abre somente ao tocar em Atualizações.</li><li>O cartão da versão instalada agora mostra a versão correta.</li></ul>';
      const current=panel.querySelector('.current-version-card');
      if(current)current.after(note);else panel.prepend(note);
    }
  };

  bindOpenButton();
  updateVersionCard();
  setTimeout(()=>{closeUpdatesDialog();bindOpenButton();updateVersionCard()},250);
  setTimeout(()=>{closeUpdatesDialog();bindOpenButton();updateVersionCard()},1000);
})();


/* =========================================================
   NOSSO CONTROLE 2.1.6 — dashboard único, scroll estável e atualização imediata
   ========================================================= */
(function installV216Stability(){
  const VERSION="2.1.6";

  function removeLegacyDuplicates(){
    document.getElementById("v201Dashboard")?.remove();
    document.getElementById("v201BillsSummary")?.remove();
    document.getElementById("v201BillFilters")?.remove();

    ["v21Dashboard","v21BillSummary","v21BillFilters"].forEach(id=>{
      const nodes=[...document.querySelectorAll(`[id="${id}"]`)];
      nodes.slice(1).forEach(node=>node.remove());
    });
  }

  // Avoid useless scrollTo(current position) calls generated by older iPhone fixes.
  if(!window.__v216ScrollPatched){
    window.__v216ScrollPatched=true;
    const nativeScrollTo=window.scrollTo.bind(window);
    window.scrollTo=function(...args){
      let top,left;
      if(typeof args[0]==="object"&&args[0]!==null){
        top=Number(args[0].top ?? window.scrollY);
        left=Number(args[0].left ?? window.scrollX);
      }else{
        left=Number(args[0] ?? window.scrollX);
        top=Number(args[1] ?? window.scrollY);
      }
      if(Math.abs(top-window.scrollY)<2&&Math.abs(left-window.scrollX)<2)return;
      return nativeScrollTo(...args);
    };
  }

  // Replaces the old nested viewport reset that caused Safari to fight the user scroll.
  closeKeyboardAndResetViewport=function(goTop=false){
    try{document.activeElement?.blur()}catch{}
    if(goTop){
      requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"}));
    }
  };

  // Persist without rebuilding and restoring scroll several times.
  persist=async function(successMessage){
    try{document.activeElement?.blur()}catch{}
    state.updatedAt=new Date().toISOString();
    render();
    removeLegacyDuplicates();
    const payload=structuredClone(state);
    const {error}=await sb.from("finance_state")
      .update({data:payload,updated_at:payload.updatedAt})
      .eq("household_id",householdId);
    if(error){
      toast("Falha ao sincronizar. Tentando novamente…");
      setTimeout(async()=>{
        const retry=await sb.from("finance_state")
          .update({data:payload,updated_at:new Date().toISOString()})
          .eq("household_id",householdId);
        toast(retry.error?"Não foi possível sincronizar":"Sincronizado");
      },1200);
    }else if(successMessage){
      toast(successMessage);
    }
  };

  function updateVersionUI(){
    const panel=document.querySelector("#updatesDialog .updates-panel");
    if(panel){
      panel.querySelectorAll(".version-orb,.updates-version-badge,.settings-version")
        .forEach(el=>el.textContent=VERSION);
      const currentTitle=panel.querySelector(".current-version-card strong");
      if(currentTitle)currentTitle.textContent=`Nosso Controle ${VERSION}`;
      const currentSubtitle=panel.querySelector(".current-version-card small");
      if(currentSubtitle)currentSubtitle.textContent="Dashboard único, scroll estável e atualização automática";

      if(!panel.querySelector(".v216-note")){
        const note=document.createElement("section");
        note.className="v12-release-note v216-note";
        note.innerHTML=`
          <span>VERSÃO ${VERSION} · ESTABILIDADE</span>
          <h3>Interface e atualização corrigidas</h3>
          <ul>
            <li>Removido definitivamente o dashboard antigo que duplicava a tela.</li>
            <li>Mantido apenas um resumo e um conjunto de filtros nas Bills.</li>
            <li>Scroll estabilizado no Safari durante movimentos rápidos.</li>
            <li>Removidas reconstruções e reposicionamentos repetidos da página.</li>
            <li>Arquivos passam a ser buscados diretamente da rede, sem cache antigo.</li>
            <li>Atualizações entram automaticamente ao abrir o endereço normal.</li>
          </ul>`;
        const current=panel.querySelector(".current-version-card");
        if(current)current.insertAdjacentElement("afterend",note);
        else panel.prepend(note);
      }
    }
    document.querySelectorAll(".updates-version-badge,.settings-version")
      .forEach(el=>el.textContent=VERSION);
  }

  function closeUpdatesOnStartup(){
    const dialog=document.getElementById("updatesDialog");
    if(dialog?.open){
      try{dialog.close()}catch{dialog.removeAttribute("open")}
    }
  }

  function install(){
    removeLegacyDuplicates();
    updateVersionUI();
  }

  history.scrollRestoration="manual";
  closeUpdatesOnStartup();
  install();
  window.addEventListener("pageshow",()=>{
    closeUpdatesOnStartup();
    requestAnimationFrame(install);
  });
  setTimeout(install,250);
  setTimeout(install,1000);
})();


/* =========================================================
   NOSSO CONTROLE 2.1.7 — LIMPEZAS DIÁRIAS E RELEASE NOTES
   ========================================================= */
(function installV217CleaningControl(){
  const VERSION="2.1.7";
  const $=id=>document.getElementById(id);
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const today=()=>currentLocalDate();
  const safeOpen=d=>{if(!d)return;try{d.showModal()}catch{d.setAttribute("open","")}};
  const safeClose=d=>{if(!d)return;try{d.close()}catch{d.removeAttribute("open")}};

  function dateAtNoon(value){return new Date(`${value||today()}T12:00:00`)}
  function dateKey(value){
    if(!value)return today();
    if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return today();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function startOfWeekKey(){
    const d=dateAtNoon(today());
    const day=(d.getDay()+6)%7;
    d.setDate(d.getDate()-day);
    return dateKey(d.toISOString());
  }
  function cleanings(){
    state.incomes=Array.isArray(state.incomes)?state.incomes:[];
    return state.incomes.filter(x=>x.source==="cleaning");
  }
  function total(items){return items.reduce((sum,x)=>sum+Number(x.amount||0),0)}
  function periodTotals(){
    const all=cleanings();
    const day=today(), week=startOfWeekKey(), month=day.slice(0,7);
    return {
      today:total(all.filter(x=>dateKey(x.date)===day)),
      week:total(all.filter(x=>dateKey(x.date)>=week&&dateKey(x.date)<=day)),
      month:total(all.filter(x=>dateKey(x.date).slice(0,7)===month))
    };
  }

  function ensureDialog(){
    if($("cleaningDialog"))return;
    const dialog=document.createElement("dialog");
    dialog.id="cleaningDialog";
    dialog.innerHTML=`
      <form method="dialog" class="dialog-card">
        <input id="cleaningEditId" type="hidden">
        <div class="dialog-heading">
          <div><h2 id="cleaningDialogTitle">Registrar limpeza</h2><p>Controle cada pagamento recebido no dia correto.</p></div>
          <button value="cancel" class="round-button">×</button>
        </div>
        <div class="v217-cleaning-dialog-intro">O pagamento entra automaticamente em Receitas e atualiza o saldo, o calendário, o histórico e os resumos mensais.</div>
        <label>Cliente ou casa<input id="cleaningClient" type="text" maxlength="80" placeholder="Ex.: Casa da Sarah"></label>
        <label>Valor recebido<input id="cleaningAmount" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0,00"></label>
        <label>Recebido por
          <select id="cleaningPerson">
            <option value="casal">Casal</option>
            <option value="lucas">Lucas</option>
            <option value="namorada">Namorada</option>
          </select>
        </label>
        <label>Data <span>(opcional)</span><input id="cleaningDate" type="date"><small class="v217-optional-hint">Se deixar vazio, será usada a data de hoje.</small></label>
        <label>Observação<input id="cleaningNotes" type="text" maxlength="120" placeholder="Ex.: Limpeza semanal, pagamento em dinheiro"></label>
        <button id="saveCleaning" value="cancel" class="primary-button">Salvar pagamento</button>
      </form>`;
    document.body.appendChild(dialog);
    $("saveCleaning").onclick=saveCleaning;
  }

  function openCleaning(id=""){
    ensureDialog();
    const item=id?cleanings().find(x=>x.id===id):null;
    $("cleaningEditId").value=item?.id||"";
    $("cleaningDialogTitle").textContent=item?"Editar pagamento":"Registrar limpeza";
    $("cleaningClient").value=item?.client||item?.description||"";
    $("cleaningAmount").value=item?.amount||"";
    $("cleaningPerson").value=item?.person||"casal";
    $("cleaningDate").value=item?.date||"";
    $("cleaningNotes").value=item?.notes||"";
    safeOpen($("cleaningDialog"));
    setTimeout(()=>$("cleaningClient")?.focus(),120);
  }

  async function saveCleaning(event){
    event.preventDefault();
    const amount=Number($("cleaningAmount").value)||0;
    const client=$("cleaningClient").value.trim();
    if(!client)return toast("Informe o cliente ou a casa");
    if(amount<=0)return toast("Digite um valor válido");
    const editId=$("cleaningEditId").value;
    const payload={
      amount,
      description:client,
      client,
      notes:$("cleaningNotes").value.trim(),
      person:$("cleaningPerson").value,
      date:$("cleaningDate").value||today(),
      source:"cleaning",
      category:"limpeza"
    };
    state.incomes=Array.isArray(state.incomes)?state.incomes:[];
    if(editId){
      const item=state.incomes.find(x=>x.id===editId);
      if(item)Object.assign(item,payload);
    }else{
      state.incomes.push({id:crypto.randomUUID(),...payload});
    }
    safeClose($("cleaningDialog"));
    try{document.activeElement?.blur()}catch{}
    await persist(editId?"Pagamento da limpeza atualizado":"Pagamento da limpeza registrado");
  }

  async function deleteCleaning(id){
    const item=cleanings().find(x=>x.id===id);
    if(!item)return;
    if(!confirm(`Excluir o pagamento de ${item.client||item.description}?`))return;
    state.incomes=state.incomes.filter(x=>x.id!==id);
    await persist("Pagamento da limpeza excluído");
  }

  function installAction(){
    const actions=qs("#v21Dashboard .v21-actions");
    if(!actions||$("v217CleaningAction"))return;
    const button=document.createElement("button");
    button.id="v217CleaningAction";
    button.className="v217-cleaning-action";
    button.innerHTML='<span>＋</span><div><b>Registrar limpeza</b><small>Pagamento diário por cliente</small></div>';
    actions.prepend(button);
    button.onclick=()=>openCleaning();
  }

  function renderCleaningSection(){
    const dashboard=$("v21Dashboard");
    if(!dashboard||!state)return;
    let section=$("v217CleaningSummary");
    if(!section){
      section=document.createElement("section");
      section.id="v217CleaningSummary";
      section.className="v217-cleaning-summary";
      const recent=qs(".v21-recent",dashboard);
      recent?.insertAdjacentElement("beforebegin",section);
    }
    const totals=periodTotals();
    const todays=cleanings().filter(x=>dateKey(x.date)===today()).sort((a,b)=>String(b.createdAt||b.id).localeCompare(String(a.createdAt||a.id)));
    section.innerHTML=`
      <div class="v217-cleaning-head">
        <div><span>LIMPEZAS</span><h3>Pagamentos de hoje</h3></div>
        <button id="v217AddCleaningInline">+ Registrar</button>
      </div>
      <div class="v217-cleaning-metrics">
        <article><span>Hoje</span><strong>${money(totals.today)}</strong></article>
        <article><span>Esta semana</span><strong>${money(totals.week)}</strong></article>
        <article><span>Este mês</span><strong>${money(totals.month)}</strong></article>
      </div>
      <div class="v217-cleaning-list">
        ${todays.length?todays.map(item=>`
          <article class="v217-cleaning-item">
            <span class="v217-cleaning-icon">↗</span>
            <div><b>${item.client||item.description||"Limpeza"}</b><small>${item.person==="lucas"?"Lucas":item.person==="namorada"?"Namorada":"Casal"}${item.notes?` · ${item.notes}`:""}</small></div>
            <span class="v217-cleaning-value">+${money(Number(item.amount||0))}</span>
            <div class="v217-cleaning-actions"><button data-cleaning-edit="${item.id}">✎</button><button data-cleaning-delete="${item.id}">×</button></div>
          </article>`).join(""):'<div class="v217-cleaning-empty">Nenhum pagamento de limpeza registrado hoje.</div>'}
      </div>`;
    $("v217AddCleaningInline").onclick=()=>openCleaning();
    qsa("[data-cleaning-edit]",section).forEach(button=>button.onclick=()=>openCleaning(button.dataset.cleaningEdit));
    qsa("[data-cleaning-delete]",section).forEach(button=>button.onclick=()=>deleteCleaning(button.dataset.cleaningDelete));
  }

  const RELEASES=[
    {version:"2.1.7",date:"04/08/2026",title:"Controle diário de limpezas",changes:[
      "Restaurado o registro específico dos pagamentos das limpezas.",
      "Cliente, valor, responsável, data opcional e observação.",
      "Totais separados de hoje, semana e mês.",
      "Edição e exclusão dos pagamentos.",
      "Integração automática com Receitas, saldo, calendário, histórico e PDF.",
      "Aba Atualizações reconstruída para mostrar sempre a versão instalada."
    ]},
    {version:"2.1.6",date:"04/08/2026",title:"Estabilidade da interface",changes:[
      "Remoção do dashboard duplicado.","Scroll estabilizado no Safari.","Atualização dos arquivos diretamente pela rede."
    ]},
    {version:"2.1.5",date:"04/08/2026",title:"Inicialização correta",changes:[
      "Atualizações deixam de abrir sozinhas.","Dialogs fechados ao restaurar a página no Safari."
    ]},
    {version:"2.1.4",date:"04/08/2026",title:"Username e sessão",changes:[
      "Login aceita Username ou e-mail durante a migração.","Cadastro de Username para contas antigas.","Correções no controle de versão dos arquivos."
    ]},
    {version:"2.1.3",date:"04/08/2026",title:"Bills e configurações",changes:[
      "Layout organizado das Configurações restaurado.","Resumo e filtros duplicados das Bills removidos."
    ]},
    {version:"2.1.1",date:"04/08/2026",title:"Experiência no iPhone",changes:[
      "Correção do zoom automático.","Filtros das Bills refeitos.","Sessão persistente no iPhone."
    ]},
    {version:"2.0.1",date:"03/08/2026",title:"Clean Premium",changes:[
      "Novo dashboard com saldo livre.","Bills compactas.","Ações rápidas e visual simplificado."
    ]}
  ];

  function renderReleaseNotes(){
    const panel=qs("#updatesDialog .updates-panel");
    if(!panel)return;
    const header=qs(".updates-header",panel);
    qsa(":scope > *",panel).forEach(child=>{if(child!==header)child.remove()});
    const current=RELEASES[0];
    const currentCard=document.createElement("section");
    currentCard.className="release-current-v217";
    currentCard.innerHTML=`<div><span class="release-orb-v217">${current.version}</span><div><small>VERSÃO INSTALADA</small><strong>Nosso Controle ${current.version}</strong><p>${current.title}</p></div></div><span>Atual</span>`;
    panel.appendChild(currentCard);
    const history=document.createElement("section");
    history.className="release-history-v217";
    history.innerHTML=RELEASES.map((release,index)=>`
      <article class="release-card-v217 ${index===0?"current":""}">
        <header><span>Versão ${release.version}${index===0?" · Atual":""}</span><time>${release.date}</time></header>
        <h3>${release.title}</h3>
        <ul>${release.changes.map(change=>`<li>${change}</li>`).join("")}</ul>
      </article>`).join("");
    panel.appendChild(history);
    qsa(".updates-version-badge,.settings-version").forEach(el=>el.textContent=VERSION);
  }

  const previousRender=typeof render==="function"?render:null;
  if(previousRender&&!window.__v217RenderWrapped){
    window.__v217RenderWrapped=true;
    render=function(){
      previousRender();
      ensureDialog();
      installAction();
      renderCleaningSection();
      renderReleaseNotes();
    };
  }

  function install(){
    ensureDialog();
    installAction();
    renderCleaningSection();
    renderReleaseNotes();
    const dialog=$("updatesDialog");
    if(dialog?.open)safeClose(dialog);
  }

  install();
  window.addEventListener("pageshow",()=>requestAnimationFrame(install));
  setTimeout(install,300);
  setTimeout(install,1100);
})();
