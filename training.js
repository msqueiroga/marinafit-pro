let mfCheckinOpen=false;
const mfTimers={};
const mfPrograms={
  3:{id:'app-3',name:'Plano MarinaFit - 3 dias',source:'Programa do app',sessions:[
    {id:'a',label:'Treino A',focus:'Corpo todo',items:[
      {name:'Extensão de joelho',label:'Cadeira extensora',sets:3,reps:'12',rest:'60 s'},
      {name:'Puxada frontal',label:'Puxada alta na polia',sets:3,reps:'12',rest:'60 s'},
      {name:'Supino na máquina',label:'Supino vertical na máquina',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação de quadril',label:'Ponte pélvica',sets:3,reps:'12',rest:'45 s'},
      {name:'Panturrilha em pé',label:'Panturrilha em pé',sets:3,reps:'15',rest:'45 s'},
      {name:'Dead bug',label:'Core profundo (dead bug)',sets:2,reps:'8 por lado',rest:'45 s'}]},
    {id:'b',label:'Treino B',focus:'Corpo todo',items:[
      {name:'Leg press',label:'Leg press horizontal',sets:3,reps:'12',rest:'60 s'},
      {name:'Remada baixa',label:'Remada baixa sentada',sets:3,reps:'12',rest:'60 s'},
      {name:'Mesa flexora',label:'Cadeira flexora',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação lateral',label:'Elevação lateral com halter leve',sets:3,reps:'12',rest:'45 s'},
      {name:'Bird dog',label:'Core profundo (bird dog)',sets:2,reps:'8 por lado',rest:'45 s'},
      {name:'Alongamento de posterior',label:'Mobilidade final',sets:2,reps:'30 s',rest:'—'}]},
    {id:'a2',label:'Treino A',focus:'Corpo todo',items:[
      {name:'Extensão de joelho',label:'Cadeira extensora',sets:3,reps:'12',rest:'60 s'},
      {name:'Puxada frontal',label:'Puxada alta na polia',sets:3,reps:'12',rest:'60 s'},
      {name:'Supino na máquina',label:'Supino vertical na máquina',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação de quadril',label:'Ponte pélvica',sets:3,reps:'12',rest:'45 s'},
      {name:'Panturrilha em pé',label:'Panturrilha em pé',sets:3,reps:'15',rest:'45 s'},
      {name:'Respiração 360°',label:'Respiração e core profundo',sets:2,reps:'6–8 respirações',rest:'45 s'}]}
  ]},
  4:{id:'app-4',name:'Plano MarinaFit - 4 dias',source:'Programa do app',sessions:[
    {id:'upper-a',label:'Treino A',focus:'Membros superiores',items:[
      {name:'Supino na máquina',label:'Supino na máquina',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Puxada frontal',label:'Puxada frontal',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Remada baixa',label:'Remada baixa',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Elevação lateral',label:'Elevação lateral',sets:3,reps:'12',rest:'45 s'}]},
    {id:'lower-a',label:'Treino B',focus:'Membros inferiores',items:[
      {name:'Leg press',label:'Leg press',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Mesa flexora',label:'Mesa flexora',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Elevação de quadril',label:'Elevação de quadril',sets:3,reps:'12',rest:'45 s'},
      {name:'Panturrilha em pé',label:'Panturrilha em pé',sets:3,reps:'15',rest:'45 s'}]},
    {id:'upper-b',label:'Treino C',focus:'Costas, ombros e braços',items:[
      {name:'Remada baixa',label:'Remada baixa',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Face pull com elástico',label:'Face pull',sets:3,reps:'12',rest:'45 s'},
      {name:'Rosca direta',label:'Rosca direta',sets:3,reps:'10–12',rest:'45 s'},
      {name:'Tríceps na polia',label:'Tríceps na polia',sets:3,reps:'10–12',rest:'45 s'}]},
    {id:'lower-b',label:'Treino D',focus:'Pernas, glúteos e core',items:[
      {name:'Extensão de joelho',label:'Cadeira extensora',sets:3,reps:'12',rest:'60 s'},
      {name:'Afundo alternado',label:'Afundo alternado',sets:3,reps:'8 por lado',rest:'60 s'},
      {name:'Caminhada lateral com elástico',label:'Caminhada lateral com elástico',sets:3,reps:'12 passos por lado',rest:'45 s'},
      {name:'Dead bug',label:'Core profundo',sets:2,reps:'8 por lado',rest:'45 s'}]}
  ]},
  5:{id:'app-5',name:'Plano MarinaFit - 5 dias',source:'Programa do app',sessions:[
    {id:'upper-a',label:'Treino A',focus:'Membros superiores',items:[
      {name:'Supino na máquina',label:'Supino na máquina',sets:3,reps:'12',rest:'60 s'},
      {name:'Puxada frontal',label:'Puxada frontal',sets:3,reps:'12',rest:'60 s'},
      {name:'Remada baixa',label:'Remada baixa',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação lateral',label:'Elevação lateral',sets:3,reps:'12',rest:'45 s'},
      {name:'Respiração 360°',label:'Core profundo',sets:2,reps:'6–8 respirações',rest:'45 s'}]},
    {id:'lower-a',label:'Treino B',focus:'Membros inferiores',items:[
      {name:'Extensão de joelho',label:'Cadeira extensora',sets:3,reps:'12',rest:'60 s'},
      {name:'Mesa flexora',label:'Cadeira flexora',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação de quadril',label:'Ponte pélvica',sets:3,reps:'12',rest:'45 s'},
      {name:'Panturrilha em pé',label:'Panturrilha em pé',sets:3,reps:'15',rest:'45 s'}]},
    {id:'core-cardio',label:'Treino C',focus:'Cardio leve e core',items:[
      {name:'Agachamento controlado',label:'Agachamento controlado',sets:3,reps:'10–12',rest:'60 s'},
      {name:'Bird dog',label:'Bird dog',sets:3,reps:'8 por lado',rest:'45 s'},
      {name:'Dead bug',label:'Dead bug',sets:3,reps:'8 por lado',rest:'45 s'},
      {name:'Mobilidade de quadril 90/90',label:'Mobilidade de quadril',sets:2,reps:'8 por lado',rest:'—'}]},
    {id:'upper-b',label:'Treino A',focus:'Membros superiores',items:[
      {name:'Supino na máquina',label:'Supino na máquina',sets:3,reps:'12',rest:'60 s'},
      {name:'Puxada frontal',label:'Puxada frontal',sets:3,reps:'12',rest:'60 s'},
      {name:'Remada baixa',label:'Remada baixa',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação lateral',label:'Elevação lateral',sets:3,reps:'12',rest:'45 s'},
      {name:'Respiração 360°',label:'Core profundo',sets:2,reps:'6–8 respirações',rest:'45 s'}]},
    {id:'lower-b',label:'Treino B',focus:'Membros inferiores',items:[
      {name:'Extensão de joelho',label:'Cadeira extensora',sets:3,reps:'12',rest:'60 s'},
      {name:'Mesa flexora',label:'Cadeira flexora',sets:3,reps:'12',rest:'60 s'},
      {name:'Elevação de quadril',label:'Ponte pélvica',sets:3,reps:'12',rest:'45 s'},
      {name:'Panturrilha em pé',label:'Panturrilha em pé',sets:3,reps:'15',rest:'45 s'}]}
  ]}
};

function mfTrainingState(){if(!db.training)db.training={autoStart:iso(),activeSheet:null,dailyChoices:{},dailyAdaptations:{},progress:{},completed:{},forceToday:{},librarySet:[],variants:{},browseTab:'Meu treino'};if(!Array.isArray(db.training.librarySet))db.training.librarySet=[];if(!db.training.variants)db.training.variants={};return db.training}
function mfItemFromExercise(exercise){const dose=String(exercise.detail||'').match(/(\d+)\s*séries?\s*·\s*([^·]+)/i);return {name:exercise.name,label:exercise.name,sets:dose?dose[1]:'3',reps:dose?dose[2].trim():'10–12',rest:'60 s',library:exercise}}
function mfToggleLibraryExercise(name){const state=mfTrainingState(),index=state.librarySet.indexOf(name);if(index>=0){state.librarySet.splice(index,1);toast(`${name} removido do seu conjunto de treino.`)}else{state.librarySet.push(name);toast(`${name} incluído no seu conjunto de treino.`)}saveLocalOnly();renderExercises();if($('#workout').classList.contains('active'))mfRenderWorkout()}
function mfLibraryItems(){return mfTrainingState().librarySet.map(mfFindExercise).filter(Boolean).map(mfItemFromExercise)}
function mfAssessmentFocusItem(today){const selected=db.profile.limitations||[];const focus={Coluna:'Gato-vaca',Lombar:'Dead bug','Pescoço / cervical':'Retração cervical suave',Joelho:'Isometria na parede',Ombro:'Rotação externa',Punho:'Mobilidade de ombro na parede',Panturrilha:'Panturrilha em pé',Tornozelo:'Dorsiflexão com elástico'};const names=selected.map(area=>focus[area]).filter(Boolean);if(db.profile.diastasisFocus)names.push('Respiração 360°');if(db.profile.goal==='Mobilidade')names.push('Gato-vaca','Mobilidade de ombro na parede','Mobilidade de quadril 90/90');const name=names.length?names[today.ordinal%names.length]:null,exercise=name&&mfFindExercise(name);return exercise?mfItemFromExercise(exercise):null}
function mfWeekdays(){const count=Number(db.profile.days||3);return ({3:[1,3,5],4:[1,2,4,5],5:[1,2,3,4,5],6:[1,2,3,4,5,6]})[count]||[1,3,5]}
function mfLocalDate(value){return new Date(`${value}T12:00:00`)}
function mfAddDays(value,days){const d=mfLocalDate(value);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function mfValidSheet(){const active=mfTrainingState().activeSheet;if(!active)return null;const sheet=(db.sheets||[]).find(item=>`${item.date}|${item.name}`===active.key);if(!sheet||(!sheet.reviewed&&!active.allowUnreviewed)||active.startDate>iso()||active.validUntil<iso())return null;return {sheet,active}}
function mfSheetItem(value){const text=String(value||'').trim().replace(/^[•\-–—\d.)\s]+/,'');const prescription=text.match(/(\d+)\s*(?:x|×)\s*(\d+(?:\s*(?:-|a|à)\s*\d+)?(?:\s+por\s+lado)?)/i),rest=text.match(/(?:descanso\s*)?(\d+)\s*(?:s|seg(?:undos)?)/i);const label=(prescription?text.replace(prescription[0],''):text).replace(/[·•:;\-–—]\s*$/,'').replace(/\s{2,}/g,' ').trim()||text;return {name:label,label,sets:prescription?prescription[1]:'Conforme ficha',reps:prescription?prescription[2]:'Conforme ficha',rest:rest?`${rest[1]} s`:'—',prescription:text}}
function mfDefaultSessionText(sheet){const items=typeof sheetItemsForDisplay==='function'?sheetItemsForDisplay(sheet):(sheet.items?.length?sheet.items:parseSheet(sheet.raw||''));return `Treino A | ${sheet.name}\n${items.join('\n')}`}
function mfParseSheetSessions(value,sheet){const blocks=String(value||'').split(/^\s*---+\s*$/m).map(block=>block.trim()).filter(Boolean);const sessions=blocks.map((block,index)=>{const lines=block.split(/\n+/).map(line=>line.trim()).filter(Boolean);const heading=lines.shift()||`Treino ${String.fromCharCode(65+index)}`;const [labelPart,focusPart]=heading.split('|').map(part=>part.trim());const items=lines.map(mfSheetItem).filter(item=>item.name.length>1);return {id:`sheet-${index}`,label:labelPart||`Treino ${String.fromCharCode(65+index)}`,focus:focusPart||'Ficha profissional',items}}).filter(session=>session.items.length);if(sessions.length)return sessions;const sourceItems=typeof sheetItemsForDisplay==='function'?sheetItemsForDisplay(sheet):(sheet.items?.length?sheet.items:parseSheet(sheet.raw||''));const items=sourceItems.map(mfSheetItem);return [{id:'sheet-0',label:'Ficha do profissional',focus:'Treino registrado',items}]}
function mfProgramForToday(){const state=mfTrainingState(),active=mfValidSheet(),choice=state.dailyChoices[iso()]||((active&&`sheet:${active.active.key}`)||'app');if(choice.startsWith('sheet:')&&active&&choice===`sheet:${active.active.key}`){return {key:choice,name:active.sheet.name,source:'Ficha profissional',validUntil:active.active.validUntil,startDate:active.active.startDate,sessions:active.active.sessions?.length?active.active.sessions:mfParseSheetSessions('',active.sheet)}}const count=Number(db.profile.days||3),program=mfPrograms[count]||mfPrograms[3];const expiry=mfAddDays(state.autoStart||iso(),28);if(expiry<iso()){state.autoStart=iso();saveLocalOnly()}return {...program,key:'app',validUntil:mfAddDays(state.autoStart||iso(),28),startDate:state.autoStart||iso()}}
function mfScheduledCount(start,end){let total=0,d=mfLocalDate(start),last=mfLocalDate(end),weekdays=mfWeekdays();while(d<=last){if(weekdays.includes(d.getDay()))total++;d.setDate(d.getDate()+1)}return total}
function mfNextScheduledDate(from){let d=mfLocalDate(from),weekdays=mfWeekdays();for(let i=0;i<8;i++){if(weekdays.includes(d.getDay()))return d.toISOString().slice(0,10);d.setDate(d.getDate()+1)}return from}
function mfSessionForToday(program){const state=mfTrainingState(),today=iso(),isScheduled=mfWeekdays().includes(mfLocalDate(today).getDay()),forced=state.forceToday[today];const plannedDate=isScheduled||forced?today:mfNextScheduledDate(today);const ordinal=Math.max(0,mfScheduledCount(program.startDate,plannedDate)-1),baseSession=program.sessions[ordinal%program.sessions.length],focus=mfAssessmentFocusItem({ordinal}),extra=[...(focus?[focus]:[]),...mfLibraryItems()],items=[...baseSession.items,...extra].filter((item,index,list)=>list.findIndex(other=>normalizeText(other.name)===normalizeText(item.name))===index);return {session:{...baseSession,items},isScheduled:isScheduled||forced,plannedDate,ordinal}}
function mfWeekPreview(program){const start=mfLocalDate(iso()),weekdays=mfWeekdays();return `<div class="week-preview" aria-label="Programação dos próximos sete dias">${Array.from({length:7},(_,index)=>{const day=new Date(start);day.setDate(start.getDate()+index);const key=day.toISOString().slice(0,10),scheduled=weekdays.includes(day.getDay()),ordinal=Math.max(0,mfScheduledCount(program.startDate,key)-1),session=scheduled?program.sessions[ordinal%program.sessions.length]:null;return `<div class="week-day ${key===iso()?'today':''} ${scheduled?'scheduled':'rest'}"><small>${day.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</small><b>${day.getDate()}</b><span>${session?escapeHTML(session.label):'Descanso'}</span></div>`}).join('')}</div>`}
function mfFindExercise(name){const normalized=normalizeText(name);return exercises.find(exercise=>normalizeText(exercise.name)===normalized)||exercises.find(exercise=>normalized.includes(normalizeText(exercise.name))||normalizeText(exercise.name).includes(normalized))}
function mfTodayEquipment(){return $$('[name="mf-today-equipment"]:checked').map(input=>input.value)}
function mfSavedAdaptation(){return mfTrainingState().dailyAdaptations[iso()]||null}
function mfReadCurrentCheckin(){const pain={};limitations.forEach(area=>pain[area]=+($(`#${painInputId(area)}`)?.value||0));return {energy:+($('#energy')?.value||3),sleep:$('#sleep')?.value||'2',stress:$('#stress')?.value||'2',pain,equipment:getTodayEquipment(),note:$('#todayNotes')?.value.trim()||'',date:iso()}}
function mfGoalAdjust(item){if(!Number.isFinite(+item.sets))return item;const goal=db.profile.goal||'Força';if(goal==='Hipertrofia')return {...item,reps:'8–12',rest:'60–75 s'};if(goal==='Emagrecimento'||goal==='Condicionamento')return {...item,reps:'12–15',rest:'30–45 s'};if(goal==='Mobilidade')return {...item,sets:2,reps:'8 lentas ou 30 s',rest:'30 s'};return {...item,reps:'6–10',rest:item.rest==='—'?'—':'60–75 s'}}
function mfAdaptItems(items,adaptation){const current=adaptation||{},high=Object.entries(current.pain||{}).filter(([,value])=>value>=6).map(([area])=>area),moderate=Object.entries(current.pain||{}).filter(([,value])=>value>=4&&value<6).map(([area])=>area),available=current.equipment?.length?current.equipment:(db.profile.equipment||[]);return items.map(item=>{const library=item.library||mfFindExercise(item.name),sensitive=library&&high.some(area=>exerciseIsAffectedByPain(library,area)),equipmentUnavailable=library&&available.length&&!supportsEquipment(library.equip,available);if(sensitive||equipmentUnavailable){const alternative=equivalentsFor(item.name,available).find(exercise=>!high.some(area=>exerciseIsAffectedByPain(exercise,area)));if(!alternative)return sensitive?null:{...item,library};return {...item,name:alternative.name,label:alternative.name,sets:moderate.length?Math.max(1,(+item.sets||3)-1):item.sets,adaptedFrom:item.label||item.name,library:alternative}}return {...item,sets:moderate.length&&Number.isFinite(+item.sets)?Math.max(1,(+item.sets)-1):item.sets,library}}).filter(Boolean).map(mfGoalAdjust).filter((item,index,list)=>list.findIndex(other=>normalizeText(other.library?.name||other.name)===normalizeText(item.library?.name||item.name))===index)}
function mfProgressKey(program,session,index){return `${program.key}|${session.id}|${index}`}
function mfTimerId(key){return `mf-timer-${String(key).replace(/[^a-z0-9_-]/gi,'-')}`}
function mfCleanExerciseLabel(value){return String(value||'').replace(/[·•:;\-–—]\s*$/,'').trim()}
function mfFormatTimer(seconds){return new Date(Math.max(0,seconds)*1000).toISOString().slice(14,19)}
function mfExerciseCard(item,index,program,session){const state=mfTrainingState(),key=mfProgressKey(program,session,index),progress=state.progress[iso()]?.[key]||{},exercise=item.library||mfFindExercise(item.name),done=!!progress.done,details=exercise?.detail||'Conforme ficha profissional',demo=exercise?.youtube||item.name,label=mfCleanExerciseLabel(item.label||item.name);return `<article class="planned-exercise ${done?'completed':''}"><div class="planned-exercise-top"><span class="exercise-glyph">${exercise?.glyph||'▤'}</span><div><p class="eyebrow">EXERCÍCIO ${index+1}</p><h3>${escapeHTML(label)}</h3><p>${exercise?.area||'Ficha importada'}${item.adaptedFrom?` · adaptado de ${escapeHTML(item.adaptedFrom)}`:''}</p></div><span class="exercise-check">${done?'✓':'○'}</span></div><div class="exercise-targets"><span><b>${item.sets}</b> séries</span><span><b>${item.reps}</b> repetições</span><span><b>${item.rest}</b> descanso</span></div><p class="exercise-detail">${escapeHTML(details)}</p><div class="exercise-tools"><a class="outline" target="_blank" href="https://www.youtube.com/results?search_query=${encodeURIComponent(demo)}">▶ Ver exemplo</a><button class="outline mf-timer-button" data-mf-timer="${key}">Iniciar cronômetro</button><strong class="mf-timer-display" id="${mfTimerId(key)}">00:00</strong></div><div class="exercise-log"><label>Carga (kg)<input type="number" min="0" step="0.5" value="${progress.load||''}" data-mf-load="${key}" placeholder="Opcional" /></label><label>Repetições feitas<input type="number" min="0" value="${progress.reps||''}" data-mf-reps="${key}" placeholder="Ex.: 12" /></label><button class="${done?'outline':'primary'}" data-mf-complete="${key}">${done?'Desmarcar':'Concluir exercício'}</button></div></article>`}
function mfAttachExerciseControls(program,session){$$('[data-mf-timer]').forEach(button=>button.onclick=()=>{const key=button.dataset.mfTimer,display=$(`#${mfTimerId(key)}`);if(mfTimers[key]){clearInterval(mfTimers[key].id);delete mfTimers[key];button.textContent='Continuar cronômetro';return}const current=+(display.dataset.seconds||0);let seconds=current;mfTimers[key]={id:setInterval(()=>{seconds++;if(!document.body.contains(display)){clearInterval(mfTimers[key]?.id);delete mfTimers[key];return}display.dataset.seconds=seconds;display.textContent=mfFormatTimer(seconds)},1000)};button.textContent='Pausar cronômetro'});$$('[data-mf-load],[data-mf-reps]').forEach(input=>input.onchange=()=>{const key=input.dataset.mfLoad||input.dataset.mfReps,state=mfTrainingState();state.progress[iso()]||={};state.progress[iso()][key]={...(state.progress[iso()][key]||{}),[input.dataset.mfLoad?'load':'reps']:input.value};saveLocalOnly()});$$('[data-mf-complete]').forEach(button=>button.onclick=()=>{const key=button.dataset.mfComplete,state=mfTrainingState();state.progress[iso()]||={};state.progress[iso()][key]={...(state.progress[iso()][key]||{}),done:!(state.progress[iso()][key]?.done)};saveLocalOnly();mfRenderWorkout()});$('#mfFinishWorkout').onclick=()=>{const state=mfTrainingState();state.completed[iso()]||={};const completionKey=`${program.key}|${session.id}`;if(!state.completed[iso()][completionKey]){state.completed[iso()][completionKey]=true;db.workouts.push({date:iso(),program:program.name,session:session.label,adapted:!!mfSavedAdaptation()});save();toast('Treino concluído e salvo na sua evolução.')}else toast('Este treino já foi concluído hoje.')}}
function mfRenderWorkout(){const host=$('#validatedSheets'),result=$('#workoutResult'),box=$('#checkinBox');if(!host||!result||!box)return;const state=mfTrainingState(),active=mfValidSheet(),program=mfProgramForToday(),today=mfSessionForToday(program),adaptation=mfSavedAdaptation(),items=mfAdaptItems(today.session.items,adaptation),sources=[`<option value="app" ${program.key==='app'?'selected':''}>Programa automático do app</option>`,...(active?[`<option value="sheet:${active.active.key}" ${program.key!=='app'?'selected':''}>Ficha ativa: ${escapeHTML(active.sheet.name)}</option>`]:[])];host.hidden=false;host.innerHTML=`<article class="today-program panel"><div><p class="eyebrow">PLANO ATIVO</p><h2>${escapeHTML(program.name)}</h2><p class="hint">${program.source} · válido até ${new Date(program.validUntil+'T12:00').toLocaleDateString('pt-BR')}</p></div><div class="today-program-actions"><label>Usar hoje<select id="mfPlanChoice">${sources.join('')}</select></label><button class="outline" id="mfOpenCheckin">${adaptation?'Revisar adaptação de hoje':'Adaptar ao meu dia'}</button></div>${mfWeekPreview(program)}</article>`;$('#mfPlanChoice').onchange=event=>{state.dailyChoices[iso()]=event.target.value;saveLocalOnly();mfRenderWorkout()};$('#mfOpenCheckin').onclick=()=>{mfCheckinOpen=!mfCheckinOpen;box.hidden=!mfCheckinOpen;if(mfCheckinOpen){$('#generateWorkout').textContent='Aplicar adaptação ao treino de hoje →';box.scrollIntoView({behavior:'smooth',block:'start'})}};box.hidden=!mfCheckinOpen;result.hidden=false;$('#newCheckin').hidden=true;$('#workoutSubtitle').textContent=today.isScheduled?`${today.session.label} · ${today.session.focus}`:`Hoje é descanso programado. O próximo treino é em ${new Date(today.plannedDate+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'})}.`;const stateNote=adaptation?`Adaptado para o seu check-in de hoje.${adaptation.note?` Observação: ${escapeHTML(adaptation.note)}`:''}`:'Sem adaptação aplicada hoje.';result.innerHTML=`<article class="workout-card planned-workout"><div class="workout-top"><div><p class="eyebrow">${today.isScheduled?'TREINO DE HOJE':'PRÓXIMO TREINO'}</p><h2>${today.session.label} · ${today.session.focus}</h2><p>${items.length} exercícios programados · ${stateNote}</p></div><div class="adaptation-note">${adaptation?'Check-in aplicado':'Use “Adaptar ao meu dia” se houver dor, fadiga ou mudança de equipamento.'}</div></div>${today.isScheduled?'':`<button class="primary mf-train-next" id="mfTrainNext">Fazer este treino hoje →</button>`}<div class="planned-exercise-list">${items.map((item,index)=>mfExerciseCard(item,index,program,today.session)).join('')||'<p class="empty">Não há exercício seguro disponível para esta combinação de cuidados hoje.</p>'}</div><button class="primary finish-workout" id="mfFinishWorkout">Concluir treino de hoje ✓</button></article>`;if(!today.isScheduled)$('#mfTrainNext').onclick=()=>{state.forceToday[iso()]=true;saveLocalOnly();mfRenderWorkout()};mfAttachExerciseControls(program,today.session)}
function mfApplyTodayCheckin(){const state=mfTrainingState();state.dailyAdaptations[iso()]=mfReadCurrentCheckin();mfCheckinOpen=false;saveLocalOnly();mfRenderWorkout();setTimeout(()=>$('#workoutResult').scrollIntoView({behavior:'smooth',block:'start'}),20);toast('Adaptação aplicada ao treino de hoje.')}
function mfOpenSheetActivation(index){const sheet=(db.sheets||[])[index];if(!sheet)return;modal(`<div class="sheet-review"><p class="eyebrow">ATIVAR FICHA</p><h2>${escapeHTML(sheet.name)}</h2><p class="hint">Ela terá prioridade na tela Treino enquanto estiver válida. Se houver dias A/B/C, cada bloco abaixo vira um dia do plano. Separe os blocos por uma linha com três traços (---).</p><label>Data de início<input type="date" id="mfSheetStart" value="${iso()}" /></label><label>Válida até<input type="date" id="mfSheetEnd" value="${mfAddDays(iso(),28)}" /></label><label>Organização do plano<textarea id="mfSheetSessions" rows="12" spellcheck="true">${escapeHTML(mfDefaultSessionText(sheet))}</textarea><small class="hint">Use a primeira linha como “Treino A | Membros inferiores”, depois liste os exercícios. Ex.: Leg press 3x12. Assim o app preserva a sequência, séries e repetições.</small></label><button class="primary" id="mfActivateSheet">Ativar esta ficha</button></div>`);$('#mfActivateSheet').onclick=()=>{const start=$('#mfSheetStart').value,end=$('#mfSheetEnd').value,sessions=mfParseSheetSessions($('#mfSheetSessions').value,sheet);if(!start||!end||end<start){toast('Informe um período de validade válido.');return}if(!sessions.length){toast('Inclua pelo menos um exercício na ficha.');return}mfTrainingState().activeSheet={key:`${sheet.date}|${sheet.name}`,startDate:start,validUntil:end,sessions};$('#modal').close();save();toast('Ficha ativada como plano prioritário.')}}
function mfUseSheetToday(index,adapt=false){const sheet=(db.sheets||[])[index];if(!sheet)return;const state=mfTrainingState(),key=`${sheet.date}|${sheet.name}`;state.activeSheet={key,startDate:iso(),validUntil:iso(),sessions:mfParseSheetSessions('',sheet),allowUnreviewed:true};state.dailyChoices[iso()]=`sheet:${key}`;mfCheckinOpen=!!adapt;saveLocalOnly();go('workout');mfRenderWorkout();if(adapt){$('#generateWorkout').textContent='Aplicar adaptação à ficha de hoje →';$('#checkinBox').scrollIntoView({behavior:'smooth',block:'start'})}toast(adapt?'Ficha aberta para receber adaptações do dia.':'Ficha aberta no formato de treino de hoje.')}
function mfEnhanceSheets(){const rows=$$('#sheetList .sheet-row');rows.forEach((row,index)=>{const sheet=(db.sheets||[])[index];if(!sheet?.reviewed||row.querySelector('[data-mf-activate-sheet]'))return;const actions=row.querySelector('.sheet-actions');if(!actions)return;actions.insertAdjacentHTML('beforeend',`<button class="outline" data-mf-activate-sheet="${index}">Ativar como plano</button>`)});$$('[data-mf-activate-sheet]').forEach(button=>button.onclick=()=>mfOpenSheetActivation(+button.dataset.mfActivateSheet))}
function mfBootTraining(){const list=$('#sheetList'),applyButton=$('#generateWorkout');if(list)new MutationObserver(mfEnhanceSheets).observe(list,{childList:true,subtree:true});mfEnhanceSheets();applyButton.onclick=null;applyButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();mfApplyTodayCheckin()},true);$('#newCheckin').onclick=()=>{mfCheckinOpen=true;mfRenderWorkout();$('#checkinBox').scrollIntoView({behavior:'smooth',block:'start'})};window.renderWorkout=mfRenderWorkout;window.generateWorkout=mfApplyTodayCheckin;window.mfToggleLibraryExercise=mfToggleLibraryExercise;window.mfUseSheetToday=mfUseSheetToday;renderExercises();mfRenderWorkout()}

/* Treino: modalidade, varia\u00e7\u00f5es por equipamento e itens manuais do dia. */
function mfTrainingState(){
  if(!db.training)db.training={autoStart:iso(),activeSheet:null,dailyChoices:{},dailyAdaptations:{},progress:{},completed:{},forceToday:{}};
  const state=db.training;
  if(!Array.isArray(state.librarySet))state.librarySet=[];
  if(!state.variants)state.variants={};
  if(!state.manualToday)state.manualToday={};
  if(!state.browseTab)state.browseTab='Meu treino';
  return state;
}
function mfLibraryItems(){return (mfTrainingState().manualToday[iso()]||[]).map(mfFindExercise).filter(Boolean).map(mfItemFromExercise)}
function mfAddExerciseToday(name){
  const state=mfTrainingState(),todayItems=state.manualToday[iso()]||[];
  if(todayItems.includes(name)){toast('Esse exerc\u00edcio j\u00e1 est\u00e1 no treino de hoje.');return false}
  state.manualToday[iso()]=[...todayItems,name];
  state.browseTab='Meu treino';
  saveLocalOnly();
  toast(`${name} foi adicionado ao treino de hoje.`);
  return true;
}
function mfToggleLibraryExercise(name){
  const state=mfTrainingState(),todayItems=state.manualToday[iso()]||[],index=todayItems.indexOf(name);
  if(index>=0){state.manualToday[iso()]=todayItems.filter(item=>item!==name);toast(`${name} foi removido do treino de hoje.`)}
  else mfAddExerciseToday(name);
  saveLocalOnly();
  renderExercises();
  if($('#workout').classList.contains('active'))mfRenderWorkout();
}
function mfExercisesForTrainingTab(tab){
  const pilatesCare=['Pilates em casa','El\u00e1sticos','Mobilidade','Lombar','Pesco\u00e7o','Joelho','Ombro','Tornozelo'];
  if(tab==='Calistenia')return exercises.filter(exercise=>exercise.cat==='Calistenia'||exercise.cat==='El\u00e1sticos');
  if(tab==='Academia')return exercises.filter(exercise=>exercise.cat==='Academia');
  if(tab==='Pilates em casa')return exercises.filter(exercise=>pilatesCare.includes(exercise.cat));
  if(tab==='Di\u00e1stase')return exercises.filter(exercise=>exercise.cat==='Di\u00e1stase');
  return [];
}
function mfCurrentEquipment(){const adaptation=mfSavedAdaptation();return adaptation?.equipment?.length?adaptation.equipment:(db.profile.equipment||[])}
function mfExerciseOptions(item){
  const adaptation=mfSavedAdaptation(),high=Object.entries(adaptation?.pain||{}).filter(([,value])=>value>=6).map(([area])=>area);
  const base=item.library||mfFindExercise(item.name);
  const options=[base,...equivalentsFor(item.adaptedFrom||item.name,[])].filter(Boolean)
    .filter((exercise,index,list)=>list.findIndex(other=>normalizeText(other.name)===normalizeText(exercise.name))===index)
    .filter(exercise=>!high.some(area=>exerciseIsAffectedByPain(exercise,area)));
  const available=mfCurrentEquipment();
  return options.sort((left,right)=>Number(supportsEquipment(right.equip,available))-Number(supportsEquipment(left.equip,available)));
}
function mfSessionForToday(program){
  const state=mfTrainingState(),today=iso(),isScheduled=mfWeekdays().includes(mfLocalDate(today).getDay()),forced=state.forceToday[today];
  const plannedDate=isScheduled||forced?today:mfNextScheduledDate(today);
  const ordinal=Math.max(0,mfScheduledCount(program.startDate,plannedDate)-1),baseSession=program.sessions[ordinal%program.sessions.length],focus=mfAssessmentFocusItem({ordinal}),extra=[...(focus?[focus]:[]),...mfLibraryItems()];
  const items=[...baseSession.items,...extra].filter((item,index,list)=>list.findIndex(other=>normalizeText(other.name)===normalizeText(item.name))===index);
  return {session:{...baseSession,items},isScheduled:isScheduled||forced,plannedDate,ordinal};
}
function mfAdaptItems(items,adaptation){
  const current=adaptation||{},high=Object.entries(current.pain||{}).filter(([,value])=>value>=6).map(([area])=>area),moderate=Object.entries(current.pain||{}).filter(([,value])=>value>=4&&value<6).map(([area])=>area),available=current.equipment?.length?current.equipment:(db.profile.equipment||[]);
  return items.map(item=>{
    const library=item.library||mfFindExercise(item.name),sensitive=library&&high.some(area=>exerciseIsAffectedByPain(library,area)),equipmentUnavailable=library&&available.length&&!supportsEquipment(library.equip,available);
    if(sensitive||equipmentUnavailable){
      const alternative=equivalentsFor(item.name,available).find(exercise=>!high.some(area=>exerciseIsAffectedByPain(exercise,area)));
      if(!alternative)return sensitive?null:{...item,library};
      return {...item,name:alternative.name,label:alternative.name,sets:moderate.length?Math.max(1,(+item.sets||3)-1):item.sets,adaptedFrom:item.label||item.name,library:alternative};
    }
    return {...item,sets:moderate.length&&Number.isFinite(+item.sets)?Math.max(1,(+item.sets)-1):item.sets,library};
  }).filter(Boolean).map(mfGoalAdjust).filter((item,index,list)=>list.findIndex(other=>normalizeText(other.library?.name||other.name)===normalizeText(item.library?.name||item.name))===index);
}
function mfExerciseCard(item,index,program,session,catalogue=false){
  const state=mfTrainingState(),key=mfProgressKey(program,session,index),progress=state.progress[iso()]?.[key]||{},options=mfExerciseOptions(item),storedVariant=state.variants[iso()]?.[key],base=item.library||mfFindExercise(item.name),exercise=options.find(option=>option.name===storedVariant)||base||options[0],done=!!progress.done,details=exercise?.detail||'Conforme ficha profissional',demo=exercise?.youtube||item.name,variantChanged=storedVariant&&base&&normalizeText(storedVariant)!==normalizeText(base.name),label=variantChanged?exercise.name:mfCleanExerciseLabel(item.label||item.name),available=mfCurrentEquipment();
  const variation=options.length?`<label class="equipment-variation">Como fazer hoje?<select data-mf-variant="${escapeHTML(key)}" data-mf-variant-default="${escapeHTML(base?.name||exercise?.name||'')}">${options.map(option=>`<option value="${escapeHTML(option.name)}" ${option.name===exercise?.name?'selected':''}>${escapeHTML(option.name)} \u00b7 ${escapeHTML(option.equip)}${available.length&&supportsEquipment(option.equip,available)?' (dispon\u00edvel)':''}</option>`).join('')}</select><small>Escolha a varia\u00e7\u00e3o e o equipamento que voc\u00ea tem hoje.</small></label>`:'';
  const actions=catalogue?`<div class="exercise-catalogue-action"><button class="primary" data-mf-add-today="${escapeHTML(exercise?.name||item.name)}">Adicionar ao treino de hoje</button></div>`:`<div class="exercise-log"><label>Carga (kg)<input type="number" min="0" step="0.5" value="${progress.load||''}" data-mf-load="${escapeHTML(key)}" placeholder="Opcional" /></label><label>Repeti\u00e7\u00f5es feitas<input type="number" min="0" value="${progress.reps||''}" data-mf-reps="${escapeHTML(key)}" placeholder="Ex.: 12" /></label><button class="${done?'outline':'primary'}" data-mf-complete="${escapeHTML(key)}">${done?'Desmarcar':'Concluir exerc\u00edcio'}</button></div>`;
  return `<article class="planned-exercise ${done?'completed':''}"><div class="planned-exercise-top"><span class="exercise-glyph">${exercise?.glyph||'\u25a4'}</span><div><p class="eyebrow">${catalogue?'BIBLIOTECA DO GRUPO':`EXERC\u00cdCIO ${index+1}`}</p><h3>${escapeHTML(label)}</h3><p>${exercise?.area||'Ficha importada'}${item.adaptedFrom?` \u00b7 adaptado de ${escapeHTML(item.adaptedFrom)}`:''}</p></div><span class="exercise-check">${done?'\u2713':'\u25cb'}</span></div><div class="exercise-targets"><span><b>${item.sets}</b> s\u00e9ries</span><span><b>${item.reps}</b> repeti\u00e7\u00f5es</span><span><b>${item.rest}</b> descanso</span></div><p class="exercise-detail">${escapeHTML(details)}</p>${variation}<div class="exercise-tools"><a class="outline" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(demo)}">\u25b6 Ver exemplo</a>${catalogue?'':`<button class="outline mf-timer-button" data-mf-timer="${escapeHTML(key)}">Iniciar cron\u00f4metro</button><strong class="mf-timer-display" id="${mfTimerId(key)}">00:00</strong>`}</div>${actions}</article>`;
}
function mfAttachExerciseControls(program,session,catalogue=false){
  $$('[data-mf-variant]').forEach(select=>select.onchange=()=>{
    const key=select.dataset.mfVariant,state=mfTrainingState(),duplicate=$$('[data-mf-variant]').some(other=>other!==select&&other.value===select.value);
    if(duplicate){select.value=state.variants[iso()]?.[key]||select.dataset.mfVariantDefault;toast('Essa varia\u00e7\u00e3o j\u00e1 aparece no treino. Escolha outra op\u00e7\u00e3o.');return}
    state.variants[iso()]||={};state.variants[iso()][key]=select.value;saveLocalOnly();mfRenderWorkout();
  });
  $$('[data-mf-add-today]').forEach(button=>button.onclick=()=>{if(mfAddExerciseToday(button.dataset.mfAddToday))mfRenderWorkout()});
  if(catalogue)return;
  $$('[data-mf-timer]').forEach(button=>button.onclick=()=>{const key=button.dataset.mfTimer,display=$(`#${mfTimerId(key)}`);if(mfTimers[key]){clearInterval(mfTimers[key].id);delete mfTimers[key];button.textContent='Continuar cron\u00f4metro';return}const current=+(display.dataset.seconds||0);let seconds=current;mfTimers[key]={id:setInterval(()=>{seconds++;if(!document.body.contains(display)){clearInterval(mfTimers[key]?.id);delete mfTimers[key];return}display.dataset.seconds=seconds;display.textContent=mfFormatTimer(seconds)},1000)};button.textContent='Pausar cron\u00f4metro'});
  $$('[data-mf-load],[data-mf-reps]').forEach(input=>input.onchange=()=>{const key=input.dataset.mfLoad||input.dataset.mfReps,state=mfTrainingState();state.progress[iso()]||={};state.progress[iso()][key]={...(state.progress[iso()][key]||{}),[input.dataset.mfLoad?'load':'reps']:input.value};saveLocalOnly()});
  $$('[data-mf-complete]').forEach(button=>button.onclick=()=>{const key=button.dataset.mfComplete,state=mfTrainingState();state.progress[iso()]||={};state.progress[iso()][key]={...(state.progress[iso()][key]||{}),done:!(state.progress[iso()][key]?.done)};saveLocalOnly();mfRenderWorkout()});
  const finish=$('#mfFinishWorkout');
  if(finish)finish.onclick=()=>{const state=mfTrainingState();state.completed[iso()]||={};const completionKey=`${program.key}|${session.id}`;if(!state.completed[iso()][completionKey]){state.completed[iso()][completionKey]=true;db.workouts.push({date:iso(),program:program.name,session:session.label,adapted:!!mfSavedAdaptation()});save();toast('Treino conclu\u00eddo e salvo na sua evolu\u00e7\u00e3o.')}else toast('Este treino j\u00e1 foi conclu\u00eddo hoje.')};
}
function mfTrainingTabs(activeTab){
  const tabs=['Meu treino','Calistenia','Academia','Pilates em casa','Di\u00e1stase'];
  return `<article class="training-tabs panel"><div><p class="eyebrow">MODALIDADES</p><h2>Treine do jeito que faz sentido hoje</h2><p class="hint">Seu plano permanece em “Meu treino”. Nas outras abas, explore cada modalidade e acrescente apenas o exerc\u00edcio que quiser fazer hoje.</p></div><div class="training-tab-list">${tabs.map(tab=>`<button class="${tab===activeTab?'selected':''}" data-mf-training-tab="${tab}">${tab}</button>`).join('')}</div></article>`;
}
function mfRenderWorkout(){
  const host=$('#validatedSheets'),result=$('#workoutResult'),box=$('#checkinBox');if(!host||!result||!box)return;
  const state=mfTrainingState(),active=mfValidSheet(),program=mfProgramForToday(),today=mfSessionForToday(program),adaptation=mfSavedAdaptation(),items=mfAdaptItems(today.session.items,adaptation),currentTab=state.browseTab||'Meu treino',sources=[`<option value="app" ${program.key==='app'?'selected':''}>Programa autom\u00e1tico do app</option>`,...(active?[`<option value="sheet:${active.active.key}" ${program.key!=='app'?'selected':''}>Ficha ativa: ${escapeHTML(active.sheet.name)}</option>`]:[])];
  host.hidden=false;
  host.innerHTML=`<article class="today-program panel"><div><p class="eyebrow">PLANO ATIVO</p><h2>${escapeHTML(program.name)}</h2><p class="hint">${program.source} \u00b7 v\u00e1lido at\u00e9 ${new Date(program.validUntil+'T12:00').toLocaleDateString('pt-BR')}</p></div><div class="today-program-actions"><label>Usar hoje<select id="mfPlanChoice">${sources.join('')}</select></label><button class="outline" id="mfOpenCheckin">${adaptation?'Revisar adapta\u00e7\u00e3o de hoje':'Adaptar ao meu dia'}</button></div>${mfWeekPreview(program)}</article>${mfTrainingTabs(currentTab)}`;
  $('#mfPlanChoice').onchange=event=>{state.dailyChoices[iso()]=event.target.value;saveLocalOnly();mfRenderWorkout()};
  $('#mfOpenCheckin').onclick=()=>{mfCheckinOpen=!mfCheckinOpen;box.hidden=!mfCheckinOpen;if(mfCheckinOpen){$('#generateWorkout').textContent='Aplicar adapta\u00e7\u00e3o ao treino de hoje \u2192';box.scrollIntoView({behavior:'smooth',block:'start'})}};
  $$('[data-mf-training-tab]').forEach(button=>button.onclick=()=>{state.browseTab=button.dataset.mfTrainingTab;saveLocalOnly();mfRenderWorkout()});
  box.hidden=!mfCheckinOpen;result.hidden=false;$('#newCheckin').hidden=true;
  if(currentTab!=='Meu treino'){
    const catalogue=mfExercisesForTrainingTab(currentTab),catalogueProgram={key:`catalogue-${normalizeText(currentTab)}`,name:currentTab},catalogueSession={id:'library',label:currentTab,focus:'Biblioteca'};
    $('#workoutSubtitle').textContent=`${currentTab}: escolha uma varia\u00e7\u00e3o e, se quiser, acrescente-a ao treino de hoje.`;
    result.innerHTML=`<article class="workout-card planned-workout training-explorer"><div class="workout-top"><div><p class="eyebrow">${escapeHTML(currentTab.toUpperCase())}</p><h2>Biblioteca de ${escapeHTML(currentTab)}</h2><p>${catalogue.length} exerc\u00edcios organizados para esta modalidade. El\u00e1sticos e cuidados de mobilidade aparecem dentro das modalidades em que fazem sentido.</p></div><div class="adaptation-note">Escolha o equipamento no pr\u00f3prio cart\u00e3o; depois adicione o exerc\u00edcio ao treino de hoje.</div></div><div class="planned-exercise-list">${catalogue.map((exercise,index)=>mfExerciseCard(mfItemFromExercise(exercise),index,catalogueProgram,catalogueSession,true)).join('')||'<p class="empty">Nenhum exerc\u00edcio cadastrado neste grupo.</p>'}</div></article>`;
    mfAttachExerciseControls(catalogueProgram,catalogueSession,true);
    return;
  }
  $('#workoutSubtitle').textContent=today.isScheduled?`${today.session.label} \u00b7 ${today.session.focus}`:`Hoje \u00e9 descanso programado. O pr\u00f3ximo treino \u00e9 em ${new Date(today.plannedDate+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'})}.`;
  const stateNote=adaptation?`Adaptado para o seu check-in de hoje.${adaptation.note?` Observa\u00e7\u00e3o: ${escapeHTML(adaptation.note)}`:''}`:'Sem adapta\u00e7\u00e3o aplicada hoje.';
  result.innerHTML=`<article class="workout-card planned-workout"><div class="workout-top"><div><p class="eyebrow">${today.isScheduled?'TREINO DE HOJE':'PR\u00d3XIMO TREINO'}</p><h2>${today.session.label} \u00b7 ${today.session.focus}</h2><p>${items.length} exerc\u00edcios programados \u00b7 ${stateNote}</p></div><div class="adaptation-note">${adaptation?'Check-in aplicado':'Use “Adaptar ao meu dia” se houver dor, fadiga ou mudan\u00e7a de equipamento.'}</div></div>${today.isScheduled?'':`<button class="primary mf-train-next" id="mfTrainNext">Fazer este treino hoje \u2192</button>`}<div class="planned-exercise-list">${items.map((item,index)=>mfExerciseCard(item,index,program,today.session)).join('')||'<p class="empty">N\u00e3o h\u00e1 exerc\u00edcio seguro dispon\u00edvel para esta combina\u00e7\u00e3o de cuidados hoje.</p>'}</div><button class="primary finish-workout" id="mfFinishWorkout">Concluir treino de hoje \u2713</button></article>`;
  if(!today.isScheduled)$('#mfTrainNext').onclick=()=>{state.forceToday[iso()]=true;saveLocalOnly();mfRenderWorkout()};
  mfAttachExerciseControls(program,today.session);
}
/* Autorregulação por energia, sono e estresse do check-in diário. */
function mfRecoveryState(adaptation=mfSavedAdaptation()){
  if(!adaptation)return {level:'NORMAL',score:5,message:''};
  const energy=Math.min(5,Math.max(1,Number(adaptation.energy)||3));
  const sleepScore=({1:1,2:3,3:5})[String(adaptation.sleep)]||3;
  const stressScore=({1:1,2:3,3:5})[String(adaptation.stress)]||3;
  const score=energy*.5+sleepScore*.3+stressScore*.2;
  if(score<=2)return {level:'DELOAD_CRITICO',score,message:'Recuperação baixa hoje: reduza carga e cadência; priorize técnica, mobilidade confortável ou descanso se necessário.'};
  if(score<=3.5)return {level:'REDUCAO_LEVE',score,message:'Recuperação moderada: o volume foi reduzido para preservar a técnica.'};
  return {level:'NORMAL',score,message:''};
}
function mfApplyRecoveryAdjustment(item,recovery){
  if(!Number.isFinite(+item.sets)||recovery.level==='NORMAL')return item;
  const original=+item.sets,minimum=Math.min(2,original),sets=recovery.level==='DELOAD_CRITICO'?Math.max(minimum,Math.floor(original*.5)):Math.max(minimum,original-1);
  return {...item,sets,recoveryNote:recovery.message};
}
function mfAdaptItems(items,adaptation){
  const current=adaptation||{},high=Object.entries(current.pain||{}).filter(([,value])=>value>=6).map(([area])=>area),moderate=Object.entries(current.pain||{}).filter(([,value])=>value>=4&&value<6).map(([area])=>area),available=current.equipment?.length?current.equipment:(db.profile.equipment||[]),recovery=mfRecoveryState(current);
  return items.map(item=>{
    const library=item.library||mfFindExercise(item.name),sensitive=library&&high.some(area=>exerciseIsAffectedByPain(library,area)),equipmentUnavailable=library&&available.length&&!supportsEquipment(library.equip,available);
    if(sensitive||equipmentUnavailable){const alternative=equivalentsFor(item.name,available).find(exercise=>!high.some(area=>exerciseIsAffectedByPain(exercise,area)));if(!alternative)return sensitive?null:{...item,library};return {...item,name:alternative.name,label:alternative.name,sets:moderate.length?Math.max(1,(+item.sets||3)-1):item.sets,adaptedFrom:item.label||item.name,library:alternative}}
    return {...item,sets:moderate.length&&Number.isFinite(+item.sets)?Math.max(1,(+item.sets)-1):item.sets,library};
  }).filter(Boolean).map(mfGoalAdjust).map(item=>mfApplyRecoveryAdjustment(item,recovery)).filter((item,index,list)=>list.findIndex(other=>normalizeText(other.library?.name||other.name)===normalizeText(item.library?.name||item.name))===index);
}
function mfExerciseCard(item,index,program,session,catalogue=false){
  const state=mfTrainingState(),key=mfProgressKey(program,session,index),progress=state.progress[iso()]?.[key]||{},options=mfExerciseOptions(item),storedVariant=state.variants[iso()]?.[key],base=item.library||mfFindExercise(item.name),exercise=options.find(option=>option.name===storedVariant)||base||options[0],done=!!progress.done,details=exercise?.detail||'Conforme ficha profissional',demo=exercise?.youtube||item.name,variantChanged=storedVariant&&base&&normalizeText(storedVariant)!==normalizeText(base.name),label=variantChanged?exercise.name:mfCleanExerciseLabel(item.label||item.name),available=mfCurrentEquipment();
  const variation=options.length?`<label class="equipment-variation">Como fazer hoje?<select data-mf-variant="${escapeHTML(key)}" data-mf-variant-default="${escapeHTML(base?.name||exercise?.name||'')}">${options.map(option=>{const unavailable=available.length&&!supportsEquipment(option.equip,available)&&option.name!==exercise?.name;return `<option value="${escapeHTML(option.name)}" ${option.name===exercise?.name?'selected':''} ${unavailable?'disabled':''}>${escapeHTML(option.name)} · ${escapeHTML(option.equip)}${unavailable?' (indisponível hoje)':available.length?' (disponível)':''}</option>`}).join('')}</select><small>Altere os equipamentos no check-in para liberar outra forma de execução.</small></label>`:'';
  const recovery=item.recoveryNote?`<p class="exercise-recovery-note">${escapeHTML(item.recoveryNote)}</p>`:'';
  const actions=catalogue?`<div class="exercise-catalogue-action"><button class="primary" data-mf-add-today="${escapeHTML(exercise?.name||item.name)}">Adicionar ao treino de hoje</button></div>`:`<div class="exercise-log"><label>Carga (kg)<input type="number" min="0" step="0.5" value="${progress.load||''}" data-mf-load="${escapeHTML(key)}" placeholder="Opcional" /></label><label>Repetições feitas<input type="number" min="0" value="${progress.reps||''}" data-mf-reps="${escapeHTML(key)}" placeholder="Ex.: 12" /></label><button class="${done?'outline':'primary'}" data-mf-complete="${escapeHTML(key)}">${done?'Desmarcar':'Concluir exercício'}</button></div>`;
  return `<article class="planned-exercise ${done?'completed':''}"><div class="planned-exercise-top"><span class="exercise-glyph">${exercise?.glyph||'▤'}</span><div><p class="eyebrow">${catalogue?'BIBLIOTECA DO GRUPO':`EXERCÍCIO ${index+1}`}</p><h3>${escapeHTML(label)}</h3><p>${exercise?.area||'Ficha importada'}${item.adaptedFrom?` · adaptado de ${escapeHTML(item.adaptedFrom)}`:''}</p></div><span class="exercise-check">${done?'✓':'○'}</span></div><div class="exercise-targets"><span><b>${item.sets}</b> séries</span><span><b>${item.reps}</b> repetições</span><span><b>${item.rest}</b> descanso</span></div><p class="exercise-detail">${escapeHTML(details)}</p>${recovery}${variation}<div class="exercise-tools"><a class="outline" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(demo)}">▶ Ver exemplo</a>${catalogue?'':`<button class="outline mf-timer-button" data-mf-timer="${escapeHTML(key)}">Iniciar cronômetro</button><strong class="mf-timer-display" id="${mfTimerId(key)}">00:00</strong>`}</div>${actions}</article>`;
}
/* Planos automáticos por modalidade. O plano principal permanece por 4 semanas; a troca em “Usar hoje” vale só para o dia. */
const mfPlanModes=['Academia','Calistenia','Pilates em casa','Diástase'];
const mfSlot=(options,sets=3,reps='8–12',rest='60 s')=>({name:options[0],label:options[0],options,sets,reps,rest});
const mfModeTemplates={
  'Academia':[
    {id:'upper-a',label:'Treino A',focus:'Superiores: peito, costas e ombros',items:[mfSlot(['Supino na máquina','Chest press articulado','Supino reto com barra']),mfSlot(['Puxada frontal','Puxada frontal pegada neutra','Puxada frontal pegada aberta']),mfSlot(['Remada baixa','Remada articulada','Remada unilateral no cabo']),mfSlot(['Elevação lateral','Elevação lateral na máquina','Elevação lateral no cabo']),mfSlot(['Tríceps na polia','Tríceps corda na polia','Tríceps unilateral no cabo'])]},
    {id:'lower-a',label:'Treino B',focus:'Inferiores: quadríceps, posterior e glúteos',items:[mfSlot(['Leg press','Leg press 45 graus','Leg press horizontal']),mfSlot(['Mesa flexora','Cadeira flexora sentada','Mesa flexora unilateral']),mfSlot(['Elevação pélvica com barra','Coice de glúteo na máquina','Coice de glúteo no cabo']),mfSlot(['Cadeira abdutora','Cadeira adutora','Agachamento goblet']),mfSlot(['Panturrilha em pé na máquina','Panturrilha sentada na máquina','Panturrilha em pé'])]},
    {id:'pull-a',label:'Treino C',focus:'Costas, braços e postura',items:[mfSlot(['Puxada frontal supinada','Puxada frontal pegada neutra','Pulldown com braços estendidos']),mfSlot(['Remada articulada','Remada baixa','Remada unilateral no cabo']),mfSlot(['Crucifixo inverso na máquina','Face pull com elástico','Rotação externa no cabo']),mfSlot(['Rosca alternada','Rosca martelo','Rosca no cabo']),mfSlot(['Woodchop no cabo','Abdominal no cabo','Dead bug'],2,'10–12 por lado','45 s')]},
    {id:'lower-b',label:'Treino D',focus:'Inferiores: força e estabilidade',items:[mfSlot(['Agachamento no smith','Hack squat','Agachamento goblet']),mfSlot(['Levantamento terra romeno','Stiff com halteres','Stiff com barra']),mfSlot(['Cadeira extensora unilateral','Extensão de joelho','Leg press unilateral']),mfSlot(['Coice de glúteo no cabo','Elevação pélvica com barra','Cadeira abdutora']),mfSlot(['Hiperextensão no banco','Bird dog','Pallof press com elástico'],2,'8–12','45 s')]},
    {id:'upper-b',label:'Treino E',focus:'Superiores: ombros, peito, braços e core',items:[mfSlot(['Supino inclinado com halteres','Supino inclinado com barra','Crucifixo com halteres']),mfSlot(['Desenvolvimento na máquina','Desenvolvimento sentado com halteres','Desenvolvimento com halteres']),mfSlot(['Elevação lateral no cabo','Elevação lateral','Elevação frontal com halteres']),mfSlot(['Rosca Scott na máquina','Rosca direta','Rosca concentração']),mfSlot(['Tríceps corda na polia','Tríceps francês com halter','Tríceps coice'])]}
  ],
  'Calistenia':[
    {id:'push-core',label:'Treino A',focus:'Empurrar e core',items:[mfSlot(['Flexão de braço','Flexão com joelhos apoiados','Flexão na parede']),mfSlot(['Flexão com pegada aberta','Flexão com pausa no fundo','Flexão inclinada']),mfSlot(['Flexão pike','Flexão hindu','Flexão pike com pés elevados']),mfSlot(['Prancha frontal','Prancha bear','Hollow hold'],3,'20–35 segundos','45 s'),mfSlot(['Abdominal reverso','Elevação de pernas deitado','Hollow rock'],3,'8–12','45 s')]},
    {id:'legs',label:'Treino B',focus:'Pernas, glúteos e tornozelos',items:[mfSlot(['Agachamento controlado','Agachamento sumô','Agachamento com pausa']),mfSlot(['Afundo alternado','Afundo reverso','Agachamento dividido']),mfSlot(['Elevação de quadril','Ponte de glúteos unilateral','Ponte de glúteos com marcha']),mfSlot(['Panturrilha em pé','Panturrilha no degrau','Panturrilha unilateral']),mfSlot(['Equilíbrio em um pé','Agachamento cossaco','Mobilidade de tornozelo'],2,'8–10 por lado','45 s')]},
    {id:'pull-posture',label:'Treino C',focus:'Puxar, postura e core',items:[mfSlot(['Barra fixa pronada','Barra fixa assistida','Y-T-W em pronação']),mfSlot(['Remada australiana','Remada australiana supinada','Prancha reversa']),mfSlot(['Depressão escapular na barra','Sustentação ativa na barra','Hollow hold'],3,'6–10','45 s'),mfSlot(['Ponte de glúteos com marcha','Bird dog','Prancha reversa'],3,'8–12 por lado','45 s'),mfSlot(['Abdominal reverso','Dead bug','Prancha lateral'],2,'20–30 segundos','45 s')]},
    {id:'full-body',label:'Treino D',focus:'Corpo todo e coordenação',items:[mfSlot(['Flexão com pegada fechada','Flexão arqueiro assistida','Flexão de braço']),mfSlot(['Agachamento búlgaro','Agachamento pistola assistido','Afundo lateral']),mfSlot(['Elevação pélvica com apoio no sofá','Elevação de quadril','Ponte de glúteos unilateral']),mfSlot(['Remada australiana com pés elevados','Barra fixa com pegada neutra','Y-T-W em pronação']),mfSlot(['Prancha bear','Abdominal reverso','Hollow rock'],2,'8–12','45 s')]},
    {id:'skills',label:'Treino E',focus:'Progressões, potência e estabilidade',items:[mfSlot(['Flexão arqueiro','Flexão com pausa no fundo','Flexão inclinada']),mfSlot(['Agachamento pistola','Shrimp squat assistido','Agachamento cossaco']),mfSlot(['Agachamento com salto','Agachamento com pausa','Agachamento sumô']),mfSlot(['Negativa de barra fixa','Barra fixa supinada','Sustentação ativa na barra']),mfSlot(['Hollow rock','Elevação de pernas deitado','Prancha lateral'],2,'6–12','45 s')]}
  ],
  'Pilates em casa':[
    {id:'core-posture',label:'Treino A',focus:'Core, respiração e postura',items:[mfSlot(['The Hundred adaptado','Respiração 360°','Ativação profunda do core'],2,'6–10 respirações','30 s'),mfSlot(['Toe taps','Dead bug','Deslize de calcanhar controlado']),mfSlot(['Half roll back','Roll up assistido','Teaser preparatório'],2,'6–8','30 s'),mfSlot(['Gato-vaca','Roll down na parede','Spine twist sentado'],2,'6–8','30 s'),mfSlot(['Prancha de quatro apoios','Bird dog','Pallof press com elástico'],2,'8–10 por lado','30 s')]},
    {id:'lower-body',label:'Treino B',focus:'Glúteos, quadril e pernas',items:[mfSlot(['Ponte de ombros (Pilates)','Ponte de ombros unilateral','Ponte com mini band']),mfSlot(['Clam shell','Série de chutes laterais','Abdução com elástico']),mfSlot(['Círculos com a perna','Mobilidade de quadril 90/90','Agachamento com mini band']),mfSlot(['Extensão de quadril com elástico','Ponte com mini band','Elevação de quadril']),mfSlot(['Equilíbrio em um pé','Dorsiflexão com elástico','Panturrilha em pé'],2,'8–12 por lado','30 s')]},
    {id:'upper-posture',label:'Treino C',focus:'Ombros, costas e controle corporal',items:[mfSlot(['Pilates: abertura de braços com elástico','Natação (Swimming)','Y-T-W em pronação']),mfSlot(['Pilates: puxada sentada com elástico','Face pull com elástico','Prancha reversa']),mfSlot(['Rotação externa','Rotação externa no cabo','Mobilidade de ombro na parede'],2,'10–12 por lado','30 s'),mfSlot(['Mermaid stretch','Saw (serrote)','Spine twist sentado'],2,'6–8 por lado','30 s'),mfSlot(['Prancha de quatro apoios','Bird dog','Prancha lateral'],2,'15–25 segundos','30 s')]},
    {id:'mobility-balance',label:'Treino D',focus:'Mobilidade, equilíbrio e coluna',items:[mfSlot(['Roll down na parede','Gato-vaca','Saw (serrote)'],2,'6–8','30 s'),mfSlot(['Mobilidade de tornozelo','Dorsiflexão com elástico','Equilíbrio em um pé'],2,'8–12 por lado','30 s'),mfSlot(['Mobilidade de quadril 90/90','Círculos com a perna','Clam shell'],2,'6–10 por lado','30 s'),mfSlot(['Retração cervical suave','Rotação cervical confortável','Spine twist sentado'],2,'5–8 confortáveis','30 s'),mfSlot(['Toe taps','Dead bug','Half roll back'],2,'8 por lado','30 s')]},
    {id:'whole-body',label:'Treino E',focus:'Corpo todo em Pilates',items:[mfSlot(['Ponte de ombros (Pilates)','Ponte com mini band','Ponte de ombros unilateral']),mfSlot(['Single leg stretch','Toe taps','Teaser preparatório']),mfSlot(['Natação (Swimming)','Pilates: puxada sentada com elástico','Prancha reversa']),mfSlot(['Série de chutes laterais','Clam shell','Abdução em pé com elástico']),mfSlot(['Mermaid stretch','Gato-vaca','Roll down na parede'],2,'6–10','30 s')]}
  ],
  'Diástase':[
    {id:'breath-core',label:'Treino A',focus:'Respiração e ativação profunda',items:[mfSlot(['Respiração 360°'],2,'6–8 respirações','30 s'),mfSlot(['Ativação profunda do core'],2,'6–10','30 s'),mfSlot(['Deslize de calcanhar controlado'],2,'6 por lado','30 s'),mfSlot(['Marcha supina com ativação'],2,'6 por lado','30 s')]},
    {id:'control-core',label:'Treino B',focus:'Controle pélvico e core',items:[mfSlot(['Bent knee fallout controlado'],2,'6 por lado','30 s'),mfSlot(['Dead bug de calcanhar no solo'],2,'6 por lado','30 s'),mfSlot(['Quadrupedia com ativação suave'],2,'6–8 respirações','30 s'),mfSlot(['Pressão de parede com expiração'],2,'6–10','30 s')]},
    {id:'daily-function',label:'Treino C',focus:'Movimentos do dia a dia',items:[mfSlot(['Respiração 360°'],2,'6–8 respirações','30 s'),mfSlot(['Sentar e levantar com expiração'],2,'6–10','30 s'),mfSlot(['Marcha supina com ativação'],2,'6 por lado','30 s'),mfSlot(['Deslize de calcanhar controlado'],2,'6 por lado','30 s')]},
    {id:'stability-core',label:'Treino D',focus:'Estabilidade com progressão gradual',items:[mfSlot(['Ativação profunda do core'],2,'6–10','30 s'),mfSlot(['Bent knee fallout controlado'],2,'6 por lado','30 s'),mfSlot(['Quadrupedia com ativação suave'],2,'6–8 respirações','30 s'),mfSlot(['Dead bug de calcanhar no solo'],2,'6 por lado','30 s')]},
    {id:'recovery-core',label:'Treino E',focus:'Controle e mobilidade confortável',items:[mfSlot(['Respiração 360°'],2,'6–8 respirações','30 s'),mfSlot(['Pressão de parede com expiração'],2,'6–10','30 s'),mfSlot(['Marcha supina com ativação'],2,'6 por lado','30 s'),mfSlot(['Deslize de calcanhar controlado'],2,'6 por lado','30 s')]}
  ]
};
function mfTrainingState(){
  if(!db.training)db.training={autoStart:iso(),activeSheet:null,dailyChoices:{},dailyAdaptations:{},progress:{},completed:{},forceToday:{}};
  const state=db.training;
  if(!state.dailyChoices)state.dailyChoices={};if(!state.dailyAdaptations)state.dailyAdaptations={};if(!state.progress)state.progress={};if(!state.completed)state.completed={};if(!state.forceToday)state.forceToday={};
  if(!state.variants)state.variants={};if(!state.manualToday)state.manualToday={};if(!state.browseTab)state.browseTab='Meu treino';
  if(!mfPlanModes.includes(state.activeMode))state.activeMode='Academia';
  if(!state.modeStarts)state.modeStarts={};mfPlanModes.forEach(mode=>{if(!state.modeStarts[mode])state.modeStarts[mode]=state.autoStart||iso()});
  return state;
}
function mfModeMatches(mode,exercise){return exercise?.cat===mode}
function mfModeLabel(mode){return mode==='Diástase'?'Diástase — sequência guiada':mode}
function mfModeDescription(mode){return ({'Academia':'Máquinas, cabos, halteres e barras conforme o que você marcar no check-in.','Calistenia':'Peso corporal, barras e apoios. Todas as opções ficam visíveis; os apoios que exigem atenção trazem aviso de segurança.','Pilates em casa':'Solo, acessórios de Pilates e elásticos marcados por você no check-in.','Diástase':'Progressões graduais de core profundo; pare diante de dor, abaulamento ou desconforto pélvico.'})[mode]||''}
function mfModeProgram(mode,count,startDate){
  const templates=mfModeTemplates[mode]||mfModeTemplates.Academia;
  const sessions=Array.from({length:Math.max(3,Math.min(6,Number(count)||3))},(_,index)=>{const template=templates[index%templates.length];return {...template,id:`${mode}-${template.id}-${index+1}`,items:template.items.map(item=>({...item,options:[...item.options]}))}});
  return {id:`mode-${normalizeText(mode)}`,key:`mode:${mode}`,name:`${mfModeLabel(mode)} · ${sessions.length} dias`,source:'Plano automático do app',mode,startDate,validUntil:mfAddDays(startDate,28),sessions};
}
function mfProgramForToday(){
  const state=mfTrainingState(),active=mfValidSheet(),storedChoice=state.dailyChoices[iso()],todayChoice=storedChoice==='app'?'active':(storedChoice||((active&&`sheet:${active.active.key}`)||'active'));
  if(todayChoice.startsWith('sheet:')&&active&&todayChoice===`sheet:${active.active.key}`)return {key:todayChoice,name:active.sheet.name,source:'Ficha profissional',validUntil:active.active.validUntil,startDate:active.active.startDate,sessions:active.active.sessions?.length?active.active.sessions:mfParseSheetSessions('',active.sheet)};
  const mode=todayChoice.startsWith('mode:')?todayChoice.slice(5):state.activeMode;
  let start=state.modeStarts[mode]||iso();if(mfAddDays(start,28)<iso()){start=iso();state.modeStarts[mode]=start;saveLocalOnly()}
  return mfModeProgram(mode,db.profile.days,start);
}
function mfExercisesForTrainingTab(tab){return tab==='Meu treino'?[]:exercises.filter(exercise=>mfModeMatches(tab,exercise))}
function mfCurrentEquipment(){const adaptation=mfSavedAdaptation();return adaptation?.equipment?.length?adaptation.equipment:(db.profile.equipment||[])}
function mfExerciseCare(exercise){return Array.isArray(exercise?.care)?exercise.care:[]}
function mfAutomaticCandidate(items,available,high=[]){
  const options=items.map(name=>mfFindExercise(name)).filter(Boolean).filter(exercise=>!high.some(area=>exerciseIsAffectedByPain(exercise,area)));
  const marked=options.filter(exercise=>supportsEquipment(exercise.equip,available));
  const pool=marked.length?marked:options;
  return pool.find(exercise=>!exercise.safety)||pool[0]||null;
}
function mfResolveModeSlot(slot,adaptation){
  const available=adaptation?.equipment?.length?adaptation.equipment:(db.profile.equipment||[]),high=Object.entries(adaptation?.pain||{}).filter(([,value])=>value>=6).map(([area])=>area),exercise=mfAutomaticCandidate(slot.options||[slot.name],available,high)||mfFindExercise(slot.name);
  return exercise?{...slot,name:exercise.name,label:exercise.name,library:exercise}:slot;
}
function mfAssessmentFocusItems(mode,ordinal,adaptation,baseNames=[]){
  const daily=Object.entries(adaptation?.pain||{}).filter(([,value])=>value>=2&&value<6).map(([area])=>area),monthly=db.profile.limitations||[],areas=[...daily,...monthly].filter((area,index,list)=>list.indexOf(area)===index);
  if(!areas.length)return [];
  const area=areas[ordinal%areas.length],available=adaptation?.equipment?.length?adaptation.equipment:(db.profile.equipment||[]),high=Object.entries(adaptation?.pain||{}).filter(([,value])=>value>=6).map(([area])=>area);
  const candidates=exercises.filter(exercise=>mfExerciseCare(exercise).includes(area)&&!baseNames.includes(exercise.name)&&!high.some(item=>exerciseIsAffectedByPain(exercise,item)));
  const ownMode=candidates.filter(exercise=>mfModeMatches(mode,exercise)),preferred=ownMode.length?ownMode:candidates;
  const selected=mfAutomaticCandidate(preferred.map(exercise=>exercise.name),available,high);
  return selected?[{...mfItemFromExercise(selected),careFocus:area}]:[];
}
function mfLibraryItems(){return (mfTrainingState().manualToday[iso()]||[]).map(mfFindExercise).filter(Boolean).map(mfItemFromExercise)}
function mfAddExerciseToday(name){
  const state=mfTrainingState(),todayItems=state.manualToday[iso()]||[];
  if(todayItems.includes(name)){toast('Esse exercício já está no treino de hoje.');return false}
  if(todayItems.length>=2){toast('Para manter até 5 exercícios, remova um exercício manual antes de incluir outro.');return false}
  state.manualToday[iso()]=[...todayItems,name];state.browseTab='Meu treino';saveLocalOnly();toast(`${name} entrou no treino de hoje e substituirá uma opção automática, se necessário.`);return true;
}
function mfToggleLibraryExercise(name){const state=mfTrainingState(),todayItems=state.manualToday[iso()]||[],index=todayItems.indexOf(name);if(index>=0){state.manualToday[iso()]=todayItems.filter(item=>item!==name);toast(`${name} removido do treino de hoje.`)}else mfAddExerciseToday(name);saveLocalOnly();renderExercises();if($('#workout').classList.contains('active'))mfRenderWorkout()}
function mfSessionForToday(program){
  const state=mfTrainingState(),today=iso(),isScheduled=mfWeekdays().includes(mfLocalDate(today).getDay()),forced=state.forceToday[today],plannedDate=isScheduled||forced?today:mfNextScheduledDate(today),ordinal=Math.max(0,mfScheduledCount(program.startDate,plannedDate)-1),baseSession=program.sessions[ordinal%program.sessions.length],adaptation=mfSavedAdaptation();
  const resolved=baseSession.items.map(item=>mfResolveModeSlot(item,adaptation)),manual=mfLibraryItems(),care=program.mode?mfAssessmentFocusItems(program.mode,ordinal,adaptation,resolved.map(item=>item.name)):[];
  const maximumAutomatic=Math.max(0,5-care.length-Math.min(manual.length,2)),items=[...care,...resolved.slice(0,maximumAutomatic),...manual.slice(0,2)].filter((item,index,list)=>list.findIndex(other=>normalizeText(other.library?.name||other.name)===normalizeText(item.library?.name||item.name))===index).slice(0,5);
  return {session:{...baseSession,items},isScheduled:isScheduled||forced,plannedDate,ordinal};
}
function mfWeekPreview(program){const start=mfLocalDate(iso()),weekdays=mfWeekdays();return `<div class="week-preview" aria-label="Programação dos próximos sete dias">${Array.from({length:7},(_,index)=>{const day=new Date(start);day.setDate(start.getDate()+index);const key=day.toISOString().slice(0,10),scheduled=weekdays.includes(day.getDay()),ordinal=Math.max(0,mfScheduledCount(program.startDate,key)-1),session=scheduled?program.sessions[ordinal%program.sessions.length]:null;return `<div class="week-day ${key===iso()?'today':''} ${scheduled?'scheduled':'rest'}"><small>${day.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</small><b>${day.getDate()}</b><span>${session?escapeHTML(session.label):'Descanso'}</span></div>`}).join('')}</div>`}
function mfMovementPattern(exercise){
  const name=normalizeText(exercise?.name||'');
  if(/dorsiflexao/.test(name))return 'dorsiflexao';
  if(/flexao pike|parada de mao|desenvolvimento|arnold/.test(name))return 'empurrar-vertical';
  if(/elevacao lateral|elevacao frontal|remada alta/.test(name))return 'ombro-isolado';
  if(/flexao.*(fechada|diamante)|mergulho|triceps/.test(name))return 'extensao-de-cotovelo';
  if(/flexao hindu/.test(name))return 'empurrar-dinamico';
  if(/\bflexao\b|supino|chest press/.test(name))return 'empurrar-horizontal';
  if(/crucifixo|crossover/.test(name))return 'peitoral-isolado';
  if(/barra fixa|puxada|pulldown/.test(name))return 'puxar-vertical';
  if(/remada/.test(name))return 'puxar-horizontal';
  if(/rosca/.test(name))return 'flexao-de-cotovelo';
  if(/agachamento|leg press|extensao de joelho|cadeira extensora/.test(name))return 'dominante-de-joelho';
  if(/afundo|passada|subida no banco/.test(name))return 'unilateral-dominante-de-joelho';
  if(/terra|stiff|bom dia/.test(name))return 'dobradica-de-quadril';
  if(/ponte|elevacao de quadril|elevacao pelvica|coice de gluteo/.test(name))return 'extensao-de-quadril';
  if(/panturrilha/.test(name))return 'flexao-plantar';
  if(/prancha frontal|prancha bear|hollow/.test(name))return 'core-antiaoextensao';
  if(/prancha lateral|pallof/.test(name))return 'core-antirotacao-lateral';
  if(/dead bug|toe taps|abdominal reverso|elevacao de pernas/.test(name))return 'core-controle-supino';
  if(/mobilidade|alongamento|retracao cervical|rotacao cervical|gato-vaca|mermaid|spine twist|roll down|saw/.test(name))return `mobilidade:${name}`;
  if(/diastase|respiracao 360|ativacao profunda|deslize de calcanhar|bent knee fallout|marcha supina|quadrupedia com ativacao|pressao de parede|sentar e levantar com expiracao/.test(name))return `cuidado:${name}`;
  return `especifico:${name}`;
}
function mfMovementPatternLabel(pattern){
  return ({'empurrar-horizontal':'peito, tríceps e ombro anterior','empurrar-vertical':'ombros e tríceps','extensao-de-cotovelo':'tríceps','puxar-vertical':'costas e bíceps','puxar-horizontal':'costas, escápulas e bíceps','dominante-de-joelho':'quadríceps e glúteos','unilateral-dominante-de-joelho':'quadríceps, glúteos e estabilidade','dobradica-de-quadril':'posterior de coxa e glúteos','extensao-de-quadril':'glúteos e posterior','flexao-plantar':'panturrilhas','core-antiaoextensao':'core e estabilidade lombar','core-antirotacao-lateral':'core e estabilidade lateral','core-controle-supino':'core e controle lombar'})[pattern]||'a finalidade específica do exercício';
}
function mfExerciseOptions(item){
  const base=item.library||mfFindExercise(item.name),pattern=mfMovementPattern(base),family=base?.family,related=family?exercises.filter(exercise=>exercise.family===family):[],samePattern=exercises.filter(exercise=>mfMovementPattern(exercise)===pattern),equivalent=equivalentsFor(item.adaptedFrom||item.name,[]);
  return [base,...samePattern,...related,...equivalent].filter(Boolean).filter(exercise=>exercise===base||mfMovementPattern(exercise)===pattern).filter((exercise,index,list)=>list.findIndex(other=>normalizeText(other.name)===normalizeText(exercise.name))===index).slice(0,12);
}
function mfAdaptItems(items,adaptation){
  const current=adaptation||{},high=Object.entries(current.pain||{}).filter(([,value])=>value>=6).map(([area])=>area),moderate=Object.entries(current.pain||{}).filter(([,value])=>value>=4&&value<6).map(([area])=>area),available=current.equipment?.length?current.equipment:(db.profile.equipment||[]),recovery=mfRecoveryState(current);
  return items.map(item=>{
    const base=item.library||mfFindExercise(item.name),unavailable=base&&available.length&&!supportsEquipment(base.equip,available),sensitive=base&&high.some(area=>exerciseIsAffectedByPain(base,area));
    if(sensitive||unavailable){const options=mfExerciseOptions(item).filter(exercise=>supportsEquipment(exercise.equip,available)&&!high.some(area=>exerciseIsAffectedByPain(exercise,area)));const replacement=options.find(exercise=>!exercise.safety)||options[0];if(!replacement)return sensitive?null:{...item,library:base};return {...item,name:replacement.name,label:replacement.name,library:replacement,adaptedFrom:item.label||item.name,sets:moderate.length?Math.max(1,(+item.sets||3)-1):item.sets}}
    return {...item,library:base,sets:moderate.length&&Number.isFinite(+item.sets)?Math.max(1,(+item.sets)-1):item.sets};
  }).filter(Boolean).map(mfGoalAdjust).map(item=>mfApplyRecoveryAdjustment(item,recovery)).filter((item,index,list)=>list.findIndex(other=>normalizeText(other.library?.name||other.name)===normalizeText(item.library?.name||item.name))===index).slice(0,5);
}
function mfExerciseCard(item,index,program,session,catalogue=false){
  const state=mfTrainingState(),key=mfProgressKey(program,session,index),progress=state.progress[iso()]?.[key]||{},options=mfExerciseOptions(item),storedVariant=state.variants[iso()]?.[key],base=item.library||mfFindExercise(item.name),exercise=options.find(option=>option.name===storedVariant)||base||options[0],done=!!progress.done,details=exercise?.detail||'Conforme ficha profissional',demo=exercise?.youtube||item.name,label=storedVariant&&base&&normalizeText(storedVariant)!==normalizeText(base.name)?exercise.name:mfCleanExerciseLabel(item.label||item.name),available=mfCurrentEquipment(),care=mfExerciseCare(exercise),purpose=care.length?`<p class="exercise-purpose"><b>Finalidade de cuidado:</b> ${escapeHTML(care.join(', '))}</p>`:'',safety=exercise?.safety?`<p class="exercise-safety"><b>Atenção:</b> ${escapeHTML(exercise.safety)}</p>`:'';
  const variation=options.length>1?`<label class="equipment-variation">Como fazer hoje?<select data-mf-variant="${escapeHTML(key)}" data-mf-variant-default="${escapeHTML(base?.name||exercise?.name||'')}">${options.map(option=>`<option value="${escapeHTML(option.name)}" ${option.name===exercise?.name?'selected':''}>${escapeHTML(option.name)} · ${escapeHTML(option.equip)}${available.length&&supportsEquipment(option.equip,available)?' (marcado hoje)':' (não marcado)' }${option.safety?' · atenção':''}</option>`).join('')}</select><small>Somente substituições do mesmo padrão de movimento. Alvos principais preservados: ${escapeHTML(mfMovementPatternLabel(mfMovementPattern(base)))}. A carga e a ênfase podem variar; opções apenas relacionadas ficam na biblioteca.</small></label>`:'';
  const recovery=item.recoveryNote?`<p class="exercise-recovery-note">${escapeHTML(item.recoveryNote)}</p>`:'',actions=catalogue?`<div class="exercise-catalogue-action"><button class="primary" data-mf-add-today="${escapeHTML(exercise?.name||item.name)}">Adicionar ao treino de hoje</button></div>`:`<div class="exercise-log"><label>Carga (kg)<input type="number" min="0" step="0.5" value="${progress.load||''}" data-mf-load="${escapeHTML(key)}" placeholder="Opcional" /></label><label>Repetições feitas<input type="number" min="0" value="${progress.reps||''}" data-mf-reps="${escapeHTML(key)}" placeholder="Ex.: 12" /></label><button class="${done?'outline':'primary'}" data-mf-complete="${escapeHTML(key)}">${done?'Desmarcar':'Concluir exercício'}</button></div>`;
  return `<article class="planned-exercise ${done?'completed':''}"><div class="planned-exercise-top">${exerciseIllustrationMarkup(exercise,true)}<div><p class="eyebrow">${catalogue?'BIBLIOTECA DO GRUPO':`EXERCÍCIO ${index+1}`}</p><h3>${escapeHTML(label)}</h3><p>${exercise?.area||'Ficha importada'}${item.careFocus?` · cuidado selecionado: ${escapeHTML(item.careFocus)}`:''}${item.adaptedFrom?` · adaptado de ${escapeHTML(item.adaptedFrom)}`:''}</p></div><span class="exercise-check">${done?'✓':'○'}</span></div><div class="exercise-targets"><span><b>${item.sets}</b> séries</span><span><b>${item.reps}</b> repetições</span><span><b>${item.rest}</b> descanso</span></div><p class="exercise-detail">${escapeHTML(details)}</p>${purpose}${safety}${recovery}${variation}<div class="exercise-tools"><a class="outline" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(demo)}">▶ Ver exemplo</a>${catalogue?'':`<button class="outline mf-timer-button" data-mf-timer="${escapeHTML(key)}">Iniciar cronômetro</button><strong class="mf-timer-display" id="${mfTimerId(key)}">00:00</strong>`}</div>${actions}</article>`;
}
function mfTrainingTabs(activeTab){const tabs=['Meu treino','Calistenia','Academia','Pilates em casa','Diástase'];return `<article class="training-tabs panel"><div><p class="eyebrow">MODALIDADES</p><h2>Planos e biblioteca por modalidade</h2><p class="hint">Escolha uma modalidade como plano principal de 4 semanas ou faça outra somente hoje. Mobilidade e fortalecimento para regiões específicas entram como finalidade dos exercícios e na adaptação da avaliação.</p></div><div class="training-tab-list">${tabs.map(tab=>`<button class="${tab===activeTab?'selected':''}" data-mf-training-tab="${tab}">${tab}</button>`).join('')}</div></article>`}
function mfActivatePlanMode(mode){const state=mfTrainingState();state.activeMode=mode;state.modeStarts[mode]=iso();state.dailyChoices[iso()]='active';state.browseTab='Meu treino';saveLocalOnly();mfRenderWorkout();toast(`${mfModeLabel(mode)} virou seu plano principal por 4 semanas.`)}
function mfUseModeToday(mode){const state=mfTrainingState();if(!state.modeStarts[mode])state.modeStarts[mode]=iso();state.dailyChoices[iso()]=`mode:${mode}`;state.browseTab='Meu treino';saveLocalOnly();mfRenderWorkout();toast(`${mfModeLabel(mode)} foi selecionado apenas para hoje.`)}
function mfRenderWorkout(){
  const host=$('#validatedSheets'),result=$('#workoutResult'),box=$('#checkinBox');if(!host||!result||!box)return;
  const state=mfTrainingState(),active=mfValidSheet(),program=mfProgramForToday(),today=mfSessionForToday(program),adaptation=mfSavedAdaptation(),items=mfAdaptItems(today.session.items,adaptation),currentTab=state.browseTab||'Meu treino',storedChoice=state.dailyChoices[iso()],choice=storedChoice==='app'?'active':(storedChoice||((active&&`sheet:${active.active.key}`)||'active')),sources=[`<option value="active" ${choice==='active'?'selected':''}>Seguir meu plano: ${escapeHTML(state.activeMode)}</option>`,...mfPlanModes.map(mode=>`<option value="mode:${mode}" ${choice===`mode:${mode}`?'selected':''}>Fazer ${escapeHTML(mfModeLabel(mode))} somente hoje</option>`),...(active?[`<option value="sheet:${active.active.key}" ${choice===`sheet:${active.active.key}`?'selected':''}>Usar ficha profissional: ${escapeHTML(active.sheet.name)}</option>`]:[])];
  host.hidden=false;
  host.innerHTML=`<article class="today-program panel"><div><p class="eyebrow">PLANO ATIVO</p><h2>${escapeHTML(program.name)}</h2><p class="hint">${program.source} · válido até ${new Date(program.validUntil+'T12:00').toLocaleDateString('pt-BR')}</p></div><div class="today-program-actions"><label>Plano principal<select id="mfPrimaryMode">${mfPlanModes.map(mode=>`<option value="${mode}" ${state.activeMode===mode?'selected':''}>${escapeHTML(mfModeLabel(mode))}</option>`).join('')}</select></label><label>Usar hoje<select id="mfPlanChoice">${sources.join('')}</select></label><button class="outline" id="mfOpenCheckin">${adaptation?'Revisar adaptação de hoje':'Adaptar ao meu dia'}</button></div>${mfWeekPreview(program)}</article>${mfTrainingTabs(currentTab)}`;
  $('#mfPrimaryMode').onchange=event=>mfActivatePlanMode(event.target.value);
  $('#mfPlanChoice').onchange=event=>{state.dailyChoices[iso()]=event.target.value;saveLocalOnly();mfRenderWorkout()};
  $('#mfOpenCheckin').onclick=()=>{mfCheckinOpen=!mfCheckinOpen;box.hidden=!mfCheckinOpen;if(mfCheckinOpen){$('#generateWorkout').textContent='Aplicar adaptação ao treino de hoje →';box.scrollIntoView({behavior:'smooth',block:'start'})}};
  $$('[data-mf-training-tab]').forEach(button=>button.onclick=()=>{state.browseTab=button.dataset.mfTrainingTab;saveLocalOnly();mfRenderWorkout()});
  box.hidden=!mfCheckinOpen;result.hidden=false;$('#newCheckin').hidden=true;
  if(currentTab!=='Meu treino'){
    const catalogue=mfExercisesForTrainingTab(currentTab),catalogueProgram={key:`catalogue-${normalizeText(currentTab)}`,name:currentTab},catalogueSession={id:'library',label:currentTab,focus:'Biblioteca'};
    $('#workoutSubtitle').textContent=`${currentTab}: explore todos os exercícios, escolha o equipamento disponível e ative um plano quando quiser.`;
    result.innerHTML=`<article class="workout-card planned-workout training-explorer"><div class="workout-top"><div><p class="eyebrow">${escapeHTML(currentTab.toUpperCase())}</p><h2>Biblioteca de ${escapeHTML(currentTab)}</h2><p>${catalogue.length} exercícios nesta modalidade. ${escapeHTML(mfModeDescription(currentTab))}</p></div><div class="adaptation-note">Os cartões mostram a finalidade de cuidado quando ela existir e avisam sobre apoios que exigem cautela.</div></div><div class="mode-library-actions"><button class="primary" data-mf-set-plan="${currentTab}">Usar ${escapeHTML(mfModeLabel(currentTab))} como meu plano principal</button><button class="outline" data-mf-use-mode="${currentTab}">Fazer ${escapeHTML(mfModeLabel(currentTab))} hoje</button></div><div class="planned-exercise-list">${catalogue.map((exercise,index)=>mfExerciseCard(mfItemFromExercise(exercise),index,catalogueProgram,catalogueSession,true)).join('')||'<p class="empty">Nenhum exercício cadastrado neste grupo.</p>'}</div></article>`;
    $('[data-mf-set-plan]').onclick=()=>mfActivatePlanMode(currentTab);$('[data-mf-use-mode]').onclick=()=>mfUseModeToday(currentTab);mfAttachExerciseControls(catalogueProgram,catalogueSession,true);return;
  }
  $('#workoutSubtitle').textContent=today.isScheduled?`${today.session.label} · ${today.session.focus}`:`Hoje é descanso programado. O próximo treino é em ${new Date(today.plannedDate+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'})}.`;
  const stateNote=adaptation?`Adaptado para o seu check-in de hoje.${adaptation.note?` Observação: ${escapeHTML(adaptation.note)}`:''}`:'Sem adaptação aplicada hoje.';
  result.innerHTML=`<article class="workout-card planned-workout"><div class="workout-top"><div><p class="eyebrow">${today.isScheduled?'TREINO DE HOJE':'PRÓXIMO TREINO'}</p><h2>${today.session.label} · ${today.session.focus}</h2><p>${items.length} exercícios programados · ${stateNote}</p></div><div class="adaptation-note">${adaptation?'Check-in aplicado':'Use “Adaptar ao meu dia” se houver dor, fadiga ou mudança de equipamento.'}</div></div>${today.isScheduled?'':`<button class="primary mf-train-next" id="mfTrainNext">Fazer este treino hoje →</button>`}<div class="planned-exercise-list">${items.map((item,index)=>mfExerciseCard(item,index,program,today.session)).join('')||'<p class="empty">Não há exercício seguro disponível para esta combinação de cuidados hoje.</p>'}</div><button class="primary finish-workout" id="mfFinishWorkout">Concluir treino de hoje ✓</button></article>`;
  if(!today.isScheduled)$('#mfTrainNext').onclick=()=>{state.forceToday[iso()]=true;saveLocalOnly();mfRenderWorkout()};mfAttachExerciseControls(program,today.session);
}
window.renderWorkout=mfRenderWorkout;window.mfToggleLibraryExercise=mfToggleLibraryExercise;mfBootTraining();
function mfApplyTodayCheckin(){
  const state=mfTrainingState(),adaptation=mfReadCurrentCheckin(),recovery=mfRecoveryState(adaptation);
  state.dailyAdaptations[iso()]=adaptation;state.browseTab='Meu treino';mfCheckinOpen=false;saveLocalOnly();mfRenderWorkout();
  if(recovery.level!=='NORMAL'){const note=$('.planned-workout .adaptation-note');if(note)note.textContent=recovery.message;}
  setTimeout(()=>$('#workoutResult').scrollIntoView({behavior:'smooth',block:'start'}),20);
  toast(recovery.level==='NORMAL'?'Adaptação aplicada ao treino de hoje.':`Treino ajustado: ${recovery.level==='DELOAD_CRITICO'?'recuperação baixa':'volume reduzido'}.`);
}
