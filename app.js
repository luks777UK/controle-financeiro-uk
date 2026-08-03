
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
            <div><span>VERSÃO INSTALADA</span><strong>Nosso Controle 1.1.4</strong><small>Build de 03/08/2026 · correção de login</small></div>
            <span class="version-status">Atual</span>
          </section>
          <section class="updates-timeline">
            <article class="update-entry latest">
              <div class="update-marker"></div><div class="update-content">
                <div class="update-entry-head"><div><span>Versão 1.1.4</span><strong>Central de atualizações</strong></div><small>03/08/2026</small></div>
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
const sb=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
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
function show(id){["authView","householdView","appView"].forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden")}
function feedback(id,t){$(id).textContent=t||""}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2100)}
function makeCode(){return Math.random().toString(36).slice(2,10).toUpperCase()}

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
  state.updatedAt=new Date().toISOString();
  render();
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

$("loginBtn").onclick=async()=>{
  feedback("authMsg","");
  const {error}=await sb.auth.signInWithPassword({email:$("email").value,password:$("password").value});
  if(error)return feedback("authMsg",error.message);
  const {data:{session}}=await sb.auth.getSession();user=session.user;await loadMembership();
};
$("signupBtn").onclick=async()=>{
  const {error}=await sb.auth.signUp({email:$("email").value,password:$("password").value});
  feedback("authMsg",error?error.message:"Conta criada. Confirme o e-mail caso seja solicitado.");
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
            <strong>Nosso Controle 1.1.4</strong>
            <small>Correção do menu e gerenciamento de dados</small>
          </div>
          <span class="version-status">Atual</span>
        </section>

        <section class="updates-timeline">
          <article class="update-entry latest">
            <div class="update-marker"></div>
            <div class="update-content">
              <div class="update-entry-head">
                <div><span>Versão 1.1.4</span><strong>Menu e manutenção</strong></div>
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
                <div><span>Versão 1.2</span><strong>Histórico e produtividade</strong></div>
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
                <div><span>Versão 1.3</span><strong>Nuvem e aplicativo</strong></div>
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
    if(x.textContent.includes("1.1.3"))x.textContent="Nosso Controle 1.1.4";
  });
})();
