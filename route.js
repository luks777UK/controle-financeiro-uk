/* Nosso Controle 5.0 Beta — módulo Rota */
(() => {
  "use strict";

  const ROUTE_VERSION = "5.0.0-beta.1";
  const DAY_NAMES = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  const DAY_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  let selectedWeekMonday = startOfWeek(new Date());
  let selectedDayIndex = Math.max(0, Math.min(6, weekdayToMondayIndex(new Date().getDay())));
  let longPressTimer = null;
  let longPressTriggered = false;

  function el(id){ return document.getElementById(id); }
  function clone(value){ return structuredClone(value); }
  function id(){ return crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`; }
  function pad(value){ return String(value).padStart(2,"0"); }
  function localKey(date){
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  }
  function fromKey(key){
    const [y,m,d]=String(key).split("-").map(Number);
    return new Date(y,m-1,d,12,0,0,0);
  }
  function startOfWeek(value){
    const date = new Date(value);
    date.setHours(12,0,0,0);
    const mondayOffset = date.getDay() === 0 ? -6 : 1-date.getDay();
    date.setDate(date.getDate()+mondayOffset);
    return date;
  }
  function addDays(date,days){
    const result=new Date(date);
    result.setDate(result.getDate()+days);
    return result;
  }
  function weekdayToMondayIndex(day){ return day===0?6:day-1; }
  function mondayIndexToWeekday(index){ return index===6?0:index+1; }
  function weekDifference(a,b){
    return Math.round((startOfWeek(a)-startOfWeek(b))/(7*86400000));
  }
  function moneyV5(value){
    try{return money(Number(value||0));}
    catch{return `£${Number(value||0).toFixed(2)}`;}
  }
  function todayKey(){ return localKey(new Date()); }
  function escapeV5(value){
    if(typeof escapeText==="function")return escapeText(String(value??""));
    const div=document.createElement("div");div.textContent=String(value??"");return div.innerHTML;
  }

  function ensureRouteState(){
    if(!state)return null;
    if(!state.route || typeof state.route!=="object"){
      state.route={clients:[],visits:[]};
    }
    state.route.clients=Array.isArray(state.route.clients)?state.route.clients:[];
    state.route.visits=Array.isArray(state.route.visits)?state.route.visits:[];
    state.incomes=Array.isArray(state.incomes)?state.incomes:[];
    return state.route;
  }

  function activeClients(){
    return (ensureRouteState()?.clients||[]).filter(client=>client.active!==false);
  }

  function clientById(clientId){
    return (ensureRouteState()?.clients||[]).find(client=>String(client.id)===String(clientId));
  }

  function visitOverride(clientId,originalDate){
    return (ensureRouteState()?.visits||[]).find(v=>
      String(v.clientId)===String(clientId) && v.originalDate===originalDate
    );
  }

  function isClientScheduled(client,date){
    if(client.active===false)return false;
    if(Number(client.day)!==date.getDay())return false;
    const anchor=fromKey(client.anchorDate||localKey(date));
    if(date < startOfWeek(anchor))return false;
    if(client.frequency==="fortnightly"){
      return Math.abs(weekDifference(date,anchor))%2===0;
    }
    return true;
  }

  function baseInstance(client,date){
    const originalDate=localKey(date);
    const override=visitOverride(client.id,originalDate);
    const actualDate=override?.actualDate||originalDate;
    const hours=Number(override?.hours ?? client.hours ?? 0);
    const hourlyRate=Number(override?.hourlyRate ?? client.hourlyRate ?? 0);
    return {
      key:`${client.id}:${originalDate}`,
      clientId:String(client.id),
      client,
      originalDate,
      actualDate,
      hours,
      hourlyRate,
      amount:hours*hourlyRate,
      order:Number(client.order||1),
      cancelled:Boolean(override?.cancelled),
      paid:Boolean(override?.paid),
      paymentMethod:override?.paymentMethod||"",
      amountReceived:Number(override?.amountReceived||0),
      paymentDate:override?.paymentDate||"",
      override
    };
  }

  function instancesForDateRange(start,end){
    const route=ensureRouteState();
    if(!route)return [];
    const result=[];
    const seen=new Set();

    for(const client of activeClients()){
      for(let date=new Date(start);date<=end;date=addDays(date,1)){
        if(!isClientScheduled(client,date))continue;
        const instance=baseInstance(client,date);
        if(fromKey(instance.actualDate)>=start && fromKey(instance.actualDate)<=end){
          result.push(instance);
          seen.add(instance.key);
        }
      }
    }

    // Include visits moved into the selected period from another week.
    for(const override of route.visits){
      if(!override.actualDate)continue;
      const actual=fromKey(override.actualDate);
      if(actual<start||actual>end)continue;
      const key=`${override.clientId}:${override.originalDate}`;
      if(seen.has(key))continue;
      const client=clientById(override.clientId);
      if(!client)continue;
      const original=fromKey(override.originalDate);
      const instance=baseInstance(client,original);
      result.push(instance);
      seen.add(key);
    }

    return result.sort((a,b)=>{
      const dateCompare=a.actualDate.localeCompare(b.actualDate);
      if(dateCompare)return dateCompare;
      if(a.order!==b.order)return a.order-b.order;
      return a.client.name.localeCompare(b.client.name);
    });
  }

  function weekInstances(){
    return instancesForDateRange(selectedWeekMonday,addDays(selectedWeekMonday,6));
  }

  function dayInstances(dateKey){
    return weekInstances().filter(instance=>instance.actualDate===dateKey);
  }

  function upsertOverride(instance,updates){
    const route=ensureRouteState();
    let override=visitOverride(instance.clientId,instance.originalDate);
    if(!override){
      override={
        id:id(),
        clientId:instance.clientId,
        originalDate:instance.originalDate,
        actualDate:instance.originalDate,
        createdAt:new Date().toISOString()
      };
      route.visits.push(override);
    }
    Object.assign(override,updates,{updatedAt:new Date().toISOString()});
    return override;
  }

  function removeOverrideIfDefault(instance){
    const route=ensureRouteState();
    const override=visitOverride(instance.clientId,instance.originalDate);
    if(!override)return;
    const client=instance.client;
    const isDefault=
      (override.actualDate||instance.originalDate)===instance.originalDate &&
      Number(override.hours??client.hours)===Number(client.hours) &&
      Number(override.hourlyRate??client.hourlyRate)===Number(client.hourlyRate) &&
      !override.cancelled && !override.paid;
    if(isDefault){
      route.visits=route.visits.filter(v=>v!==override);
    }
  }

  function routeIncomeId(instance){ return `route-income:${instance.key}`; }

  function syncIncomeForPayment(instance,override){
    const incomeId=routeIncomeId(instance);
    state.incomes=state.incomes.filter(item=>item.id!==incomeId);
    if(!override.paid)return;
    state.incomes.push({
      id:incomeId,
      amount:Number(override.amountReceived||instance.amount),
      description:`Limpeza · ${instance.client.name}`,
      person:"casal",
      date:override.paymentDate||override.actualDate||instance.actualDate,
      source:"route",
      routeVisitKey:instance.key,
      paymentMethod:override.paymentMethod||"card"
    });
  }

  function formatWeekRange(){
    const end=addDays(selectedWeekMonday,6);
    return `${pad(selectedWeekMonday.getDate())}/${pad(selectedWeekMonday.getMonth()+1)} — ${pad(end.getDate())}/${pad(end.getMonth()+1)}`;
  }

  function renderRoute(){
    if(!state||!el("routeView"))return;
    ensureRouteState();

    const instances=weekInstances();
    const valid=instances.filter(v=>!v.cancelled);
    const expected=valid.reduce((sum,v)=>sum+v.amount,0);
    const received=valid.filter(v=>v.paid).reduce((sum,v)=>sum+v.amountReceived,0);
    const scheduledHours=valid.reduce((sum,v)=>sum+v.hours,0);
    const workedHours=valid.filter(v=>v.paid).reduce((sum,v)=>sum+v.hours,0);

    el("routeExpectedV5").textContent=moneyV5(expected);
    el("routeReceivedV5").textContent=moneyV5(received);
    el("routeHoursV5").textContent=`${scheduledHours.toFixed(scheduledHours%1?1:0)}h`;
    el("routeWorkedHoursV5").textContent=`${workedHours.toFixed(workedHours%1?1:0)}h concluídas`;
    el("routeWeekLabelV5").textContent=
      selectedWeekMonday.getTime()===startOfWeek(new Date()).getTime()?"Esta semana":"Semana selecionada";
    el("routeWeekRangeV5").textContent=formatWeekRange();

    renderDayTabs();
    renderSelectedDay();
    renderOverdue();
  }

  function renderDayTabs(){
    const container=el("routeDayTabsV5");
    container.innerHTML="";
    for(let index=0;index<7;index++){
      const date=addDays(selectedWeekMonday,index);
      const dateKey=localKey(date);
      const clients=dayInstances(dateKey).filter(v=>!v.cancelled);
      const button=document.createElement("button");
      button.type="button";
      button.className=`route-day-tab-v5 ${selectedDayIndex===index?"active":""} ${clients.length?"has-clients":""}`;
      button.innerHTML=`<span>${DAY_SHORT[date.getDay()]}</span><strong>${pad(date.getDate())}/${pad(date.getMonth()+1)}</strong><small>${clients.length}</small>`;
      button.onclick=()=>{selectedDayIndex=index;renderRoute();};
      container.appendChild(button);
    }
  }

  function renderSelectedDay(){
    const date=addDays(selectedWeekMonday,selectedDayIndex);
    const key=localKey(date);
    const items=dayInstances(key);
    const active=items.filter(v=>!v.cancelled);
    const total=active.reduce((sum,v)=>sum+v.amount,0);

    el("routeSelectedDayTitleV5").textContent=DAY_NAMES[date.getDay()];
    el("routeSelectedDaySubtitleV5").textContent=
      `${active.length} ${active.length===1?"cliente programado":"clientes programados"}`;
    el("routeSelectedDayTotalV5").textContent=moneyV5(total);

    const list=el("routeClientListV5");
    if(!items.length){
      list.innerHTML=`<div class="route-empty-v5"><b>Nenhuma limpeza neste dia</b><span>Use o botão + para cadastrar um cliente.</span></div>`;
      return;
    }

    list.innerHTML=items.map((instance,index)=>{
      const paid=instance.paid;
      const cancelled=instance.cancelled;
      const method=instance.paymentMethod==="cash"?"Dinheiro":"Cartão";
      return `<article class="route-client-card-v5 ${paid?"paid":""} ${cancelled?"cancelled":""}">
        <div class="route-order-v5">${instance.order}º</div>
        <div class="route-client-main-v5">
          <strong>${escapeV5(instance.client.name)}</strong>
          <span>${instance.hours}h × ${moneyV5(instance.hourlyRate)}/h</span>
          <small>${cancelled?"Limpeza cancelada":paid?`Pago em ${method}`:(instance.client.frequency==="fortnightly"?"Quinzenal":"Semanal")}</small>
        </div>
        <div class="route-client-value-v5">
          <strong>${moneyV5(instance.amount)}</strong>
          <button class="route-pay-button-v5 ${paid?"confirmed":""}" type="button" data-route-key="${instance.key}">
            ${cancelled?"—":paid?"Pago":"Pagar"}
          </button>
        </div>
      </article>`;
    }).join("");

    list.querySelectorAll("[data-route-key]").forEach(button=>{
      const instance=items.find(v=>v.key===button.dataset.routeKey);
      if(!instance||instance.cancelled){button.disabled=true;return;}
      bindPress(button,()=>openPayment(instance),()=>openManage(instance));
    });
  }

  function pastInstancesForOverdue(){
    const today=fromKey(todayKey());
    const start=addDays(today,-70);
    const end=addDays(today,-1);
    return instancesForDateRange(start,end)
      .filter(v=>!v.cancelled&&!v.paid)
      .sort((a,b)=>a.actualDate.localeCompare(b.actualDate));
  }

  function renderOverdue(){
    const items=pastInstancesForOverdue();
    el("routeOverdueCountV5").textContent=String(items.length);
    const list=el("routeOverdueListV5");
    if(!items.length){
      list.innerHTML='<div class="route-empty-v5"><b>Nenhum pagamento atrasado</b><span>Tudo em dia.</span></div>';
      return;
    }
    list.innerHTML=items.map(instance=>{
      const days=Math.max(1,Math.floor((fromKey(todayKey())-fromKey(instance.actualDate))/86400000));
      return `<article class="route-overdue-item-v5">
        <div>
          <strong>${escapeV5(instance.client.name)}</strong>
          <span>${new Date(`${instance.actualDate}T12:00:00`).toLocaleDateString("pt-BR")} · ${days} ${days===1?"dia":"dias"} de atraso</span>
        </div>
        <button type="button" data-overdue-key="${instance.key}">${moneyV5(instance.amount)}</button>
      </article>`;
    }).join("");
    list.querySelectorAll("[data-overdue-key]").forEach(button=>{
      const instance=items.find(v=>v.key===button.dataset.overdueKey);
      button.onclick=()=>openPayment(instance);
    });
  }

  function bindPress(element,shortAction,longAction){
    let timer=null;
    let long=false;
    const start=event=>{
      event.preventDefault();
      long=false;
      timer=setTimeout(()=>{long=true;longAction();navigator.vibrate?.(30);},2000);
    };
    const end=event=>{
      event.preventDefault();
      if(timer)clearTimeout(timer);
      if(!long)shortAction();
      timer=null;
    };
    const cancel=()=>{if(timer)clearTimeout(timer);timer=null;};
    element.addEventListener("pointerdown",start);
    element.addEventListener("pointerup",end);
    element.addEventListener("pointerleave",cancel);
    element.addEventListener("pointercancel",cancel);
    element.addEventListener("contextmenu",event=>event.preventDefault());
  }

  function openClient(client=null){
    ensureRouteState();
    el("routeClientIdV5").value=client?.id||"";
    el("routeClientDialogTitleV5").textContent=client?"Editar cliente":"Novo cliente";
    el("routeClientNameV5").value=client?.name||"";
    el("routeClientDayV5").value=String(client?.day ?? mondayIndexToWeekday(selectedDayIndex));
    el("routeClientOrderV5").value=String(client?.order||nextOrderForDay(Number(el("routeClientDayV5").value)));
    el("routeClientFrequencyV5").value=client?.frequency||"weekly";
    el("routeClientAnchorV5").value=client?.anchorDate||localKey(addDays(selectedWeekMonday,selectedDayIndex));
    el("routeClientRateV5").value=client?.hourlyRate??"";
    el("routeClientHoursV5").value=client?.hours??"";
    el("routeClientNoteV5").value=client?.note||"";
    el("deleteRouteClientV5").classList.toggle("hidden",!client);
    feedback("routeClientFeedbackV5","");
    updateClientPreview();
    el("routeClientDialogV5").showModal();
  }

  function nextOrderForDay(day){
    const orders=activeClients().filter(c=>Number(c.day)===Number(day)).map(c=>Number(c.order||0));
    return orders.length?Math.max(...orders)+1:1;
  }

  function updateClientPreview(){
    const rate=Number(el("routeClientRateV5").value||0);
    const hours=Number(el("routeClientHoursV5").value||0);
    el("routeClientAmountPreviewV5").textContent=moneyV5(rate*hours);
  }

  async function saveClient(){
    feedback("routeClientFeedbackV5","");
    const name=el("routeClientNameV5").value.trim();
    const hourlyRate=Number(el("routeClientRateV5").value||0);
    const hours=Number(el("routeClientHoursV5").value||0);
    if(!name)return feedback("routeClientFeedbackV5","Digite o nome do cliente.");
    if(hourlyRate<=0||hours<=0)return feedback("routeClientFeedbackV5","Informe o valor por hora e as horas.");

    const route=ensureRouteState();
    const clientId=el("routeClientIdV5").value;
    const payload={
      name,
      day:Number(el("routeClientDayV5").value),
      order:Math.max(1,Number(el("routeClientOrderV5").value||1)),
      frequency:el("routeClientFrequencyV5").value,
      anchorDate:el("routeClientAnchorV5").value||todayKey(),
      hourlyRate,
      hours,
      note:el("routeClientNoteV5").value.trim(),
      active:true,
      updatedAt:new Date().toISOString()
    };
    if(clientId){
      const client=clientById(clientId);
      if(client)Object.assign(client,payload);
    }else{
      route.clients.push({id:id(),createdAt:new Date().toISOString(),...payload});
    }
    el("routeClientDialogV5").close();
    await persist(clientId?"Cliente atualizado":"Cliente adicionado à rota");
  }

  async function deleteClient(){
    const client=clientById(el("routeClientIdV5").value);
    if(!client)return;
    if(!confirm(`Excluir ${client.name} da rota?\n\nO histórico de pagamentos já realizados será mantido nas receitas.`))return;
    const route=ensureRouteState();
    route.clients=route.clients.filter(c=>c.id!==client.id);
    route.visits=route.visits.filter(v=>v.clientId!==client.id||v.paid);
    el("routeClientDialogV5").close();
    await persist("Cliente removido da rota");
  }

  function openPayment(instance){
    const current=baseInstance(instance.client,fromKey(instance.originalDate));
    el("routePaymentKeyV5").value=current.key;
    el("routePaymentClientV5").textContent=`${current.client.name} · ${new Date(`${current.actualDate}T12:00:00`).toLocaleDateString("pt-BR")}`;
    el("routePaymentExpectedV5").textContent=moneyV5(current.amount);
    el("routePaymentAmountV5").value=(current.paid?current.amountReceived:current.amount).toFixed(2);
    el("routePaymentMethodV5").value=current.paymentMethod||"card";
    el("routePaymentDateV5").value=current.paymentDate||current.actualDate;
    el("removeRoutePaymentV5").classList.toggle("hidden",!current.paid);
    feedback("routePaymentFeedbackV5","");
    el("routePaymentDialogV5").showModal();
  }

  function instanceFromKey(key){
    const [clientId,...dateParts]=String(key).split(":");
    const originalDate=dateParts.join(":");
    const client=clientById(clientId);
    return client?baseInstance(client,fromKey(originalDate)):null;
  }

  async function savePayment(){
    const instance=instanceFromKey(el("routePaymentKeyV5").value);
    if(!instance)return;
    const amount=Number(el("routePaymentAmountV5").value||0);
    if(amount<=0)return feedback("routePaymentFeedbackV5","Digite o valor recebido.");
    const override=upsertOverride(instance,{
      paid:true,
      amountReceived:amount,
      paymentMethod:el("routePaymentMethodV5").value,
      paymentDate:el("routePaymentDateV5").value||todayKey()
    });
    syncIncomeForPayment(instance,override);
    el("routePaymentDialogV5").close();
    await persist("Pagamento da limpeza confirmado");
  }

  async function removePayment(){
    const instance=instanceFromKey(el("routePaymentKeyV5").value);
    if(!instance)return;
    if(!confirm("Desmarcar este pagamento? A receita correspondente também será removida."))return;
    const override=upsertOverride(instance,{
      paid:false,amountReceived:0,paymentMethod:"",paymentDate:""
    });
    syncIncomeForPayment(instance,override);
    removeOverrideIfDefault(instance);
    el("routePaymentDialogV5").close();
    await persist("Pagamento desmarcado");
  }

  function openManage(instance){
    const current=baseInstance(instance.client,fromKey(instance.originalDate));
    el("routeManageKeyV5").value=current.key;
    el("routeManageClientV5").textContent=`${current.client.name} · segurei por 2 segundos`;
    el("routeManageDateV5").value=current.actualDate;
    el("routeManageRateV5").value=String(current.hourlyRate);
    el("routeManageHoursV5").value=String(current.hours);
    el("routeManageCancelledV5").checked=current.cancelled;
    feedback("routeManageFeedbackV5","");
    updateManagePreview();
    el("routeManageDialogV5").showModal();
  }

  function updateManagePreview(){
    el("routeManageAmountPreviewV5").textContent=moneyV5(
      Number(el("routeManageRateV5").value||0)*Number(el("routeManageHoursV5").value||0)
    );
  }

  async function saveManage(){
    const instance=instanceFromKey(el("routeManageKeyV5").value);
    if(!instance)return;
    const cancelled=el("routeManageCancelledV5").checked;
    if(cancelled&&instance.paid){
      return feedback("routeManageFeedbackV5","Desmarque o pagamento antes de cancelar esta limpeza.");
    }
    upsertOverride(instance,{
      actualDate:el("routeManageDateV5").value||instance.originalDate,
      hourlyRate:Number(el("routeManageRateV5").value||instance.client.hourlyRate),
      hours:Number(el("routeManageHoursV5").value||instance.client.hours),
      cancelled
    });
    el("routeManageDialogV5").close();
    await persist(cancelled?"Limpeza cancelada":"Limpeza alterada");
  }

  async function restoreManage(){
    const instance=instanceFromKey(el("routeManageKeyV5").value);
    if(!instance)return;
    if(instance.paid)return feedback("routeManageFeedbackV5","Desmarque o pagamento antes de restaurar.");
    const route=ensureRouteState();
    route.visits=route.visits.filter(v=>!(
      String(v.clientId)===String(instance.clientId)&&v.originalDate===instance.originalDate
    ));
    el("routeManageDialogV5").close();
    await persist("Limpeza restaurada ao padrão");
  }

  function editClientFromVisit(){
    const instance=instanceFromKey(el("routeManageKeyV5").value);
    if(!instance)return;
    el("routeManageDialogV5").close();
    openClient(instance.client);
  }

  function switchToRoute(){
    document.querySelectorAll(".app-section").forEach(section=>section.classList.remove("active-section"));
    el("routeView").classList.add("active-section");
    document.querySelectorAll(".nav-item").forEach(button=>button.classList.remove("active"));
    document.querySelector('.nav-item[data-view="routeView"]')?.classList.add("active");
    window.scrollTo({top:0,left:0,behavior:"smooth"});
    renderRoute();
  }

  function bind(){
    el("openRouteClientV5")?.addEventListener("click",()=>openClient());
    el("routePrevWeekV5")?.addEventListener("click",()=>{
      selectedWeekMonday=addDays(selectedWeekMonday,-7);renderRoute();
    });
    el("routeNextWeekV5")?.addEventListener("click",()=>{
      selectedWeekMonday=addDays(selectedWeekMonday,7);renderRoute();
    });
    el("toggleRouteOverdueV5")?.addEventListener("click",()=>{
      el("routeOverdueListV5").classList.toggle("hidden");
    });

    ["routeClientRateV5","routeClientHoursV5"].forEach(id=>
      el(id)?.addEventListener("input",updateClientPreview)
    );
    ["routeManageRateV5","routeManageHoursV5"].forEach(id=>
      el(id)?.addEventListener("input",updateManagePreview)
    );

    el("saveRouteClientV5")?.addEventListener("click",saveClient);
    el("deleteRouteClientV5")?.addEventListener("click",deleteClient);
    el("saveRoutePaymentV5")?.addEventListener("click",savePayment);
    el("removeRoutePaymentV5")?.addEventListener("click",removePayment);
    el("saveRouteManageV5")?.addEventListener("click",saveManage);
    el("restoreRouteManageV5")?.addEventListener("click",restoreManage);
    el("editRouteClientFromVisitV5")?.addEventListener("click",editClientFromVisit);

    const routeNav=document.querySelector('.nav-item[data-view="routeView"]');
    if(routeNav)routeNav.onclick=switchToRoute;
  }

  // Extend the existing render without changing the original modules.
  const originalRender = typeof render==="function" ? render : null;
  if(originalRender){
    render=function(){
      originalRender();
      renderRoute();
    };
  }

  document.addEventListener("DOMContentLoaded",()=>setTimeout(bind,50));
  window.addEventListener("pageshow",()=>setTimeout(()=>{bind();renderRoute();},80));
})();