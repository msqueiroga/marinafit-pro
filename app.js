const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DBKEY='marinafit-pro-v1';
const initial={profile:{name:'',age:'',height:'',goal:'Força',days:'3',duration:'45',equipment:['Peso corporal (sem aparelho)'],limitations:[],notes:'',diastasisFocus:false,diastasisStatus:'Não sei / prevenção',diastasisGuide:{signs:[],notes:'',updated:''},avatar:''},assessments:[],weights:[],workouts:[],meals:[],nutritionPlans:[],sheets:[],water:0,photos:[],theme:'light'};
let db=JSON.parse(localStorage.getItem(DBKEY)||'null')||structuredClone(initial);
let recipeFilter='Todos';
let nutritionDate=iso();
let recipeMealPeriod='Café da manhã';
let viewHistory=['dashboard'];
let pendingSheetIndex=null;
let diastasisSequenceStep=null;
let diastasisTimerId=null;
let diastasisSeconds=300;
const trainingEquipment=['Peso corporal (sem aparelho)','Academia completa','Halteres','Barra e anilhas','Máquinas','Cabo/polia','Banco','Barra fixa','Paralelas','Elásticos longos','Mini band/elástico circular','Kettlebell','TRX/argolas','Corda','Colchonete','Bola suíça/Pilates','Mini bola de Pilates','Círculo mágico/Magic circle','Rolo de liberação (foam roller)','Discos deslizantes','Bloco de yoga'];
const homeEquipment=['Cadeira firme','Sofá firme (apoio)','Parede','Degrau/escada','Mochila com carga controlada','Garrafas de água','Cabo de vassoura (mobilidade)','Toalha','Saco de alimentos (carga leve)'];
const equipment=[...trainingEquipment,...homeEquipment];
const limitations=['Coluna','Lombar','Pescoço / cervical','Joelho','Ombro','Punho','Panturrilha','Tornozelo'];
const tests=[
 {key:'flexoes',name:'Flexões com técnica válida',unit:'repetições',measureLabel:'Total em uma tentativa',variantLabel:'Variação usada',variants:['Flexão inclinada em banco ou parede','Flexão com joelhos no colchonete','Flexão no chão'],definition:'1 repetição = descer o peito em direção ao apoio e voltar até estender os braços.',protocol:'Conte apenas as repetições completas e contínuas; mantenha o corpo alinhado e pare se perder a técnica ou sentir dor.'},
 {key:'barraRemada',name:'Barra fixa ou remada australiana',unit:'repetições',measureLabel:'Total em uma tentativa',variantLabel:'Variação usada',variants:['Barra fixa assistida','Remada australiana em barra firme'],definition:'1 repetição = puxar até levar o peito/queixo à barra e voltar com os braços estendidos.',protocol:'Escolha uma única variação e repita a mesma na próxima avaliação. Não use mesa ou porta como barra.'},
 {key:'prancha',name:'Prancha frontal',unit:'segundos',measureLabel:'Tempo de sustentação',variantLabel:'Variação usada',variants:['Antebraços e joelhos no chão','Antebraços e pés no chão'],definition:'O tempo começa na posição alinhada e termina quando quadril, ombros ou pescoço saem do alinhamento confortável.',protocol:'Mantenha cotovelos abaixo dos ombros, respire e pare se houver dor ou perda de postura.'},
 {key:'agachamento',name:'Agachamento controlado',unit:'repetições',measureLabel:'Total em uma tentativa',variantLabel:'Variação usada',variants:['Tocar levemente uma cadeira firme e subir','Agachamento livre até a profundidade confortável'],definition:'1 repetição = descer de forma controlada e voltar totalmente à posição em pé.',protocol:'Use uma cadeira firme caso escolha essa versão. Não some séries; registre o total contínuo sem forçar dor no joelho ou lombar.'},
 {key:'ponteGluteos',name:'Ponte de glúteos',unit:'repetições',measureLabel:'Total em uma tentativa',variantLabel:'Variação usada',variants:['Duas pernas no chão','Uma perna por vez (somar os dois lados)'],definition:'1 repetição = elevar o quadril até alinhar ombros, quadril e joelhos, então descer devagar.',protocol:'Deite de costas com joelhos flexionados e pés no chão. Mantenha a pelve nivelada e pare se sentir dor.'},
 {key:'mobilidadeOmbro',name:'Mobilidade de ombro',type:'shoulder',instruction:'Em pé, com os braços ao lado do corpo, eleve os dois braços à frente e acima da cabeça até onde for confortável; mantenha o tronco quieto e não force.'}
];
const diastasisSigns=['Abaulamento/cone no centro do abdômen ao levantar, tossir ou fazer esforço','Sensação de espaço ou região muito macia na linha central do abdômen','Sensação de pouca estabilidade ou fraqueza do core','Desconforto abdominal ou lombar relacionado ao esforço','Sintomas do assoalho pélvico, como peso pélvico ou perda de urina'];
const exercises=[
 {name:'Flexão de braço',cat:'Calistenia',glyph:'⌁',equip:'Peso corporal',area:'Peito · tríceps',detail:'3 séries · 8–12 repetições',youtube:'flexao+de+braco+iniciante'},
 {name:'Agachamento controlado',cat:'Calistenia',glyph:'♧',equip:'Peso corporal',area:'Pernas · glúteos',detail:'3 séries · 12 repetições',youtube:'agachamento+correto'},
 {name:'Remada baixa',cat:'Academia',glyph:'↢',equip:'Cabo/polia',area:'Costas · bíceps',detail:'3 séries · 10–12 repetições',youtube:'remada+baixa+maquina'},
 {name:'Puxada frontal',cat:'Academia',glyph:'↟',equip:'Máquinas',area:'Costas · bíceps',detail:'3 séries · 10 repetições',youtube:'puxada+frontal+maquina'},
 {name:'Elevação de quadril',cat:'Calistenia',glyph:'⌂',equip:'Peso corporal',area:'Glúteos · posterior',detail:'3 séries · 12–15 repetições',youtube:'elevacao+de+quadril'},
 {name:'Prancha frontal',cat:'Lombar',glyph:'—',equip:'Peso corporal',area:'Core · estabilidade',detail:'3 séries · 20–40 segundos',youtube:'prancha+abdominal+como+fazer'},
 {name:'Mobilidade de tornozelo',cat:'Mobilidade',glyph:'◌',equip:'Peso corporal',area:'Tornozelo · mobilidade',detail:'2 séries · 10 repetições',youtube:'mobilidade+tornozelo'},
 {name:'Extensão de joelho',cat:'Joelho',glyph:'⌇',equip:'Máquinas',area:'Quadríceps',detail:'3 séries · 12 repetições',youtube:'cadeira+extensora+execucao'},
 {name:'Rotação externa',cat:'Ombro',glyph:'◒',equip:'Elásticos',area:'Manguito · ombro',detail:'3 séries · 12 repetições',youtube:'rotacao+externa+elastico'},
 {name:'Flexão inclinada',cat:'Calistenia',glyph:'⌁',equip:'Banco',area:'Peito · tríceps',detail:'3 séries · 10–15 repetições',youtube:'flexao+inclinada'},
 {name:'Flexão declinada',cat:'Calistenia',glyph:'⌁',equip:'Banco',area:'Peito · ombros',detail:'3 séries · 6–10 repetições',youtube:'flexao+declinada'},
 {name:'Mergulho em banco',cat:'Calistenia',glyph:'↡',equip:'Banco',area:'Tríceps · ombros',detail:'3 séries · 8–12 repetições',youtube:'triceps+banco'},
 {name:'Barra fixa assistida',cat:'Calistenia',glyph:'↟',equip:'Barra fixa',area:'Costas · bíceps',detail:'3 séries · 5–8 repetições',youtube:'barra+fixa+assistida'},
 {name:'Remada australiana',cat:'Calistenia',glyph:'↢',equip:'Barra fixa',area:'Costas · bíceps',detail:'3 séries · 8–12 repetições',youtube:'remada+australiana'},
 {name:'Afundo alternado',cat:'Calistenia',glyph:'◈',equip:'Peso corporal',area:'Pernas · glúteos',detail:'3 séries · 10 por lado',youtube:'afundo+alternado'},
 {name:'Subida no banco',cat:'Calistenia',glyph:'↗',equip:'Banco',area:'Pernas · glúteos',detail:'3 séries · 10 por lado',youtube:'step+up+banco'},
 {name:'Panturrilha em pé',cat:'Calistenia',glyph:'↑',equip:'Peso corporal',area:'Panturrilha',detail:'3 séries · 15–20 repetições',youtube:'elevacao+panturrilha'},
 {name:'Dead bug',cat:'Lombar',glyph:'◌',equip:'Colchonete',area:'Core · lombar',detail:'3 séries · 8 por lado',youtube:'dead+bug+exercicio'},
 {name:'Bird dog',cat:'Lombar',glyph:'⌁',equip:'Colchonete',area:'Core · lombar',detail:'3 séries · 8 por lado',youtube:'bird+dog+exercicio'},
 {name:'Prancha lateral',cat:'Lombar',glyph:'—',equip:'Colchonete',area:'Core · oblíquos',detail:'3 séries · 20 segundos por lado',youtube:'prancha+lateral'},
 {name:'Supino com halteres',cat:'Academia',glyph:'↔',equip:'Halteres',area:'Peito · tríceps',detail:'3 séries · 8–12 repetições',youtube:'supino+halteres'},
 {name:'Supino na máquina',cat:'Academia',glyph:'↔',equip:'Máquinas',area:'Peito · tríceps',detail:'3 séries · 10–12 repetições',youtube:'supino+maquina'},
 {name:'Crucifixo no cabo',cat:'Academia',glyph:'⌒',equip:'Cabo/polia',area:'Peito',detail:'3 séries · 12 repetições',youtube:'crucifixo+cabo'},
 {name:'Desenvolvimento com halteres',cat:'Academia',glyph:'↑',equip:'Halteres',area:'Ombros · tríceps',detail:'3 séries · 8–12 repetições',youtube:'desenvolvimento+halteres'},
 {name:'Elevação lateral',cat:'Academia',glyph:'⌇',equip:'Halteres',area:'Ombros',detail:'3 séries · 12–15 repetições',youtube:'elevacao+lateral'},
 {name:'Rosca direta',cat:'Academia',glyph:'⌇',equip:'Barra e anilhas',area:'Bíceps',detail:'3 séries · 10–12 repetições',youtube:'rosca+direta'},
 {name:'Tríceps na polia',cat:'Academia',glyph:'↡',equip:'Cabo/polia',area:'Tríceps',detail:'3 séries · 10–12 repetições',youtube:'triceps+polia'},
 {name:'Leg press',cat:'Academia',glyph:'◈',equip:'Máquinas',area:'Pernas · glúteos',detail:'3 séries · 10–12 repetições',youtube:'leg+press+execucao'},
 {name:'Mesa flexora',cat:'Academia',glyph:'⌇',equip:'Máquinas',area:'Posterior de coxa',detail:'3 séries · 10–12 repetições',youtube:'mesa+flexora'},
 {name:'Cadeira abdutora',cat:'Academia',glyph:'◐',equip:'Máquinas',area:'Glúteos',detail:'3 séries · 12–15 repetições',youtube:'cadeira+abdutora'},
 {name:'Elevação pélvica com barra',cat:'Academia',glyph:'⌂',equip:'Barra e anilhas',area:'Glúteos · posterior',detail:'3 séries · 8–12 repetições',youtube:'elevacao+pelvica+barra'},
 {name:'Levantamento terra romeno',cat:'Academia',glyph:'↕',equip:'Halteres',area:'Posterior · glúteos',detail:'3 séries · 8–10 repetições',youtube:'stiff+halteres'},
 {name:'Abdução com elástico',cat:'Calistenia',glyph:'◐',equip:'Elásticos',area:'Glúteos',detail:'3 séries · 15 repetições',youtube:'abducao+elastico'},
 {name:'Caminhada lateral com elástico',cat:'Calistenia',glyph:'↔',equip:'Elásticos',area:'Glúteos · quadril',detail:'3 séries · 12 passos por lado',youtube:'caminhada+lateral+elastico'},
 {name:'Remada com elástico',cat:'Calistenia',glyph:'↢',equip:'Elásticos',area:'Costas · bíceps',detail:'3 séries · 12 repetições',youtube:'remada+elastico'},
 {name:'Puxada com elástico',cat:'Calistenia',glyph:'↟',equip:'Elásticos',area:'Costas · ombros',detail:'3 séries · 12 repetições',youtube:'puxada+elastico'},
 {name:'Mobilidade de ombro na parede',cat:'Mobilidade',glyph:'◒',equip:'Peso corporal',area:'Ombro · mobilidade',detail:'2 séries · 10 repetições',youtube:'mobilidade+ombro+parede'},
 {name:'Retração cervical suave',cat:'Pescoço',glyph:'↔',equip:'Peso corporal',area:'Pescoço · postura',detail:'2 séries · 5–10 repetições confortáveis',youtube:'retracao+cervical+queixo+para+tras+exercicio'},
 {name:'Rotação cervical confortável',cat:'Pescoço',glyph:'◌',equip:'Peso corporal',area:'Pescoço · mobilidade',detail:'2 séries · 5–10 repetições por lado',youtube:'rotacao+cervical+suave+exercicio'},
 {name:'Alongamento de posterior',cat:'Mobilidade',glyph:'↘',equip:'Colchonete',area:'Posterior · mobilidade',detail:'2 séries · 30 segundos',youtube:'alongamento+posterior+coxa'},
 {name:'Mobilidade de quadril 90/90',cat:'Mobilidade',glyph:'◉',equip:'Colchonete',area:'Quadril · mobilidade',detail:'2 séries · 8 por lado',youtube:'mobilidade+quadril+90+90'},
 {name:'Isometria na parede',cat:'Joelho',glyph:'▣',equip:'Parede',area:'Quadríceps · joelho',detail:'3 séries · 20–40 segundos',youtube:'wall+sit+exercicio'},
 {name:'Ponte de glúteos unilateral',cat:'Joelho',glyph:'⌂',equip:'Colchonete',area:'Glúteos · estabilidade',detail:'3 séries · 8 por lado',youtube:'ponte+gluteo+unilateral'},
 {name:'Equilíbrio em um pé',cat:'Tornozelo',glyph:'◉',equip:'Peso corporal',area:'Tornozelo · estabilidade',detail:'3 séries · 30 segundos por lado',youtube:'equilibrio+um+pe'},
 {name:'Dorsiflexão com elástico',cat:'Tornozelo',glyph:'↑',equip:'Elásticos',area:'Tornozelo · fortalecimento',detail:'3 séries · 15 repetições',youtube:'dorsiflexao+elastico'},
 {name:'The Hundred adaptado',cat:'Pilates em casa',glyph:'≈',equip:'Colchonete',area:'Core · respiração',detail:'1 série · 50–100 pulsações',youtube:'pilates+the+hundred+iniciante'},
 {name:'Ponte de ombros (Pilates)',cat:'Pilates em casa',glyph:'⌂',equip:'Colchonete',area:'Glúteos · posterior · core',detail:'3 séries · 10 repetições',youtube:'pilates+ponte+de+ombros'},
 {name:'Toe taps',cat:'Pilates em casa',glyph:'◌',equip:'Colchonete',area:'Core · estabilidade lombar',detail:'3 séries · 10 por lado',youtube:'pilates+toe+taps'},
 {name:'Single leg stretch',cat:'Pilates em casa',glyph:'◈',equip:'Colchonete',area:'Abdômen · quadril',detail:'3 séries · 8 por lado',youtube:'pilates+single+leg+stretch'},
 {name:'Clam shell',cat:'Pilates em casa',glyph:'◐',equip:'Colchonete',area:'Glúteos · quadril',detail:'3 séries · 12 por lado',youtube:'pilates+clam+shell'},
 {name:'Natação (Swimming)',cat:'Pilates em casa',glyph:'⌁',equip:'Colchonete',area:'Costas · glúteos · postura',detail:'3 séries · 20 segundos',youtube:'pilates+swimming+exercicio'},
 {name:'Gato-vaca',cat:'Pilates em casa',glyph:'⌒',equip:'Colchonete',area:'Coluna · mobilidade',detail:'2 séries · 8 repetições',youtube:'pilates+gato+vaca'},
 {name:'Roll down na parede',cat:'Pilates em casa',glyph:'↘',equip:'Parede',area:'Coluna · mobilidade',detail:'2 séries · 6 repetições',youtube:'pilates+roll+down+parede'},
 {name:'Círculos com a perna',cat:'Pilates em casa',glyph:'◉',equip:'Colchonete',area:'Quadril · core',detail:'2 séries · 8 por lado',youtube:'pilates+leg+circles'},
 {name:'Prancha de quatro apoios',cat:'Pilates em casa',glyph:'▣',equip:'Colchonete',area:'Core · ombros',detail:'3 séries · 20 segundos',youtube:'pilates+four+point+plank'},
 {name:'Mermaid stretch',cat:'Pilates em casa',glyph:'⌇',equip:'Colchonete',area:'Lateral do tronco · mobilidade',detail:'2 séries · 30 segundos por lado',youtube:'pilates+mermaid+stretch'},
 {name:'Pallof press com elástico',cat:'Elásticos',glyph:'↔',equip:'Elásticos longos',area:'Core · estabilidade da coluna',detail:'3 séries · 10 por lado',youtube:'pallof+press+elastico'},
 {name:'Extensão de quadril com elástico',cat:'Elásticos',glyph:'↟',equip:'Elásticos longos',area:'Glúteos · posterior',detail:'3 séries · 12 por lado',youtube:'extensao+quadril+elastico'},
 {name:'Agachamento com mini band',cat:'Elásticos',glyph:'◈',equip:'Mini band/elástico circular',area:'Pernas · glúteos',detail:'3 séries · 12 repetições',youtube:'agachamento+mini+band'},
 {name:'Ponte com mini band',cat:'Elásticos',glyph:'⌂',equip:'Mini band/elástico circular',area:'Glúteos · quadril',detail:'3 séries · 12 repetições',youtube:'ponte+gluteo+mini+band'},
 {name:'Abdução em pé com elástico',cat:'Elásticos',glyph:'◐',equip:'Mini band/elástico circular',area:'Glúteos · quadril',detail:'3 séries · 12 por lado',youtube:'abducao+em+pe+elastico'},
 {name:'Face pull com elástico',cat:'Elásticos',glyph:'↟',equip:'Elásticos longos',area:'Costas · postura · ombros',detail:'3 séries · 12 repetições',youtube:'face+pull+elastico'},
 {name:'Supino com elástico',cat:'Elásticos',glyph:'↔',equip:'Elásticos longos',area:'Peito · tríceps',detail:'3 séries · 12 repetições',youtube:'supino+elastico'},
 {name:'Rosca bíceps com elástico',cat:'Elásticos',glyph:'⌇',equip:'Elásticos longos',area:'Bíceps',detail:'3 séries · 12 repetições',youtube:'rosca+biceps+elastico'},
 {name:'Tríceps acima da cabeça com elástico',cat:'Elásticos',glyph:'↑',equip:'Elásticos longos',area:'Tríceps',detail:'3 séries · 12 repetições',youtube:'triceps+elastico+cabeca'},
 {name:'Pilates: abertura de braços com elástico',cat:'Pilates em casa',glyph:'⌇',equip:'Elásticos longos',area:'Postura · costas · ombros',detail:'2 séries · 12 repetições',youtube:'pilates+elastico+bracos'},
 {name:'Pilates: puxada sentada com elástico',cat:'Pilates em casa',glyph:'↢',equip:'Elásticos longos',area:'Costas · core',detail:'2 séries · 12 repetições',youtube:'pilates+remada+elastico'},
 {name:'Respiração 360°',cat:'Diástase',glyph:'◌',equip:'Colchonete',area:'Core profundo · controle da pressão abdominal',detail:'2 séries · 6–8 respirações lentas',youtube:'respiracao+360+diastase'},
 {name:'Ativação profunda do core',cat:'Diástase',glyph:'◉',equip:'Colchonete',area:'Core profundo · assoalho pélvico',detail:'2 séries · 6–10 repetições',youtube:'ativacao+transverso+abdomen+diastase'},
 {name:'Deslize de calcanhar controlado',cat:'Diástase',glyph:'↔',equip:'Colchonete',area:'Core profundo · estabilidade',detail:'2 séries · 6 por lado',youtube:'heel+slide+diastase'},
 {name:'Abertura de joelho controlada',cat:'Diástase',glyph:'◔',equip:'Colchonete',area:'Core profundo · controle pélvico',detail:'2 séries · 6 por lado',youtube:'bent+knee+fallout+diastase'}
];
/* Catálogo ampliado: modalidades, variações biomecânicas e finalidade de cuidado. */
const mfCatalogExercise=(name,cat,equip,area,detail,family,care=[],safety='')=>({name,cat,equip,area,detail,family,care,safety,glyph:cat==='Academia'?'▤':cat==='Diástase'?'◌':cat==='Pilates em casa'?'◈':'◆',youtube:`${name} como fazer`});
const mfExistingExerciseMetadata={
 'Flexão de braço':{family:'push'},'Flexão inclinada':{family:'push',safety:'Use banco, cadeira ou sofá apenas se estiver firme, sem deslizar e apoiado na parede.'},'Flexão declinada':{family:'push',safety:'Use um apoio firme e baixo; não faça em sofá macio ou instável.'},'Mergulho em banco':{family:'push',care:['Ombro'],safety:'Faça somente em banco ou cadeira firme, encostado na parede. Pare se o ombro incomodar.'},
 'Barra fixa assistida':{family:'pull'},'Remada australiana':{family:'pull'},'Agachamento controlado':{family:'squat',care:['Joelho']},'Afundo alternado':{family:'lunge',care:['Joelho']},'Subida no banco':{family:'step',care:['Joelho'],safety:'Use apenas banco ou degrau firme, seco e sem rodinhas.'},'Panturrilha em pé':{family:'calf',care:['Tornozelo','Panturrilha']},'Elevação de quadril':{family:'bridge',care:['Lombar']},
 'Prancha frontal':{cat:'Calistenia',family:'core',care:['Lombar']},'Dead bug':{cat:'Pilates em casa',family:'core',care:['Lombar','Coluna']},'Bird dog':{cat:'Pilates em casa',family:'core',care:['Lombar','Coluna']},'Prancha lateral':{cat:'Pilates em casa',family:'core',care:['Lombar']},'Mobilidade de tornozelo':{cat:'Pilates em casa',family:'ankle',care:['Tornozelo']},'Mobilidade de ombro na parede':{cat:'Pilates em casa',family:'shoulder-mobility',care:['Ombro']},'Retração cervical suave':{cat:'Pilates em casa',family:'neck',care:['Pescoço / cervical']},'Rotação cervical confortável':{cat:'Pilates em casa',family:'neck',care:['Pescoço / cervical']},'Alongamento de posterior':{cat:'Pilates em casa',family:'hip-mobility',care:['Lombar']},'Mobilidade de quadril 90/90':{cat:'Pilates em casa',family:'hip-mobility',care:['Lombar','Joelho']},'Isometria na parede':{cat:'Calistenia',family:'squat',care:['Joelho']},'Ponte de glúteos unilateral':{cat:'Calistenia',family:'bridge',care:['Lombar','Joelho']},'Equilíbrio em um pé':{cat:'Pilates em casa',family:'ankle',care:['Tornozelo','Joelho']},'Dorsiflexão com elástico':{cat:'Pilates em casa',family:'ankle',care:['Tornozelo']},'Rotação externa':{cat:'Pilates em casa',family:'shoulder',care:['Ombro']},
 'Extensão de joelho':{cat:'Academia',family:'knee-extension',care:['Joelho']},'Remada baixa':{family:'row'},'Puxada frontal':{family:'pull'},'Supino com halteres':{family:'push'},'Supino na máquina':{family:'push'},'Crucifixo no cabo':{family:'push'},'Desenvolvimento com halteres':{family:'shoulder'},'Elevação lateral':{family:'shoulder'},'Rosca direta':{family:'biceps'},'Tríceps na polia':{family:'triceps'},'Leg press':{family:'squat',care:['Joelho']},'Mesa flexora':{family:'hamstrings'},'Cadeira abdutora':{family:'hip'},'Elevação pélvica com barra':{family:'bridge'},'Levantamento terra romeno':{family:'hinge',care:['Lombar']},
 'Abdução com elástico':{cat:'Pilates em casa',family:'hip-band',care:['Joelho']},'Caminhada lateral com elástico':{cat:'Pilates em casa',family:'hip-band',care:['Joelho']},'Remada com elástico':{cat:'Pilates em casa',family:'row'},'Puxada com elástico':{cat:'Pilates em casa',family:'pull'},'Pallof press com elástico':{cat:'Pilates em casa',family:'core',care:['Lombar','Coluna']},'Extensão de quadril com elástico':{cat:'Pilates em casa',family:'bridge',care:['Lombar']},'Agachamento com mini band':{cat:'Pilates em casa',family:'squat',care:['Joelho']},'Ponte com mini band':{cat:'Pilates em casa',family:'bridge',care:['Lombar']},'Abdução em pé com elástico':{cat:'Pilates em casa',family:'hip-band',care:['Joelho']},'Face pull com elástico':{cat:'Pilates em casa',family:'shoulder',care:['Ombro','Pescoço / cervical']},'Supino com elástico':{cat:'Pilates em casa',family:'push'},'Rosca bíceps com elástico':{cat:'Pilates em casa',family:'biceps'},'Tríceps acima da cabeça com elástico':{cat:'Pilates em casa',family:'triceps',care:['Ombro']},'Pilates: abertura de braços com elástico':{family:'shoulder',care:['Ombro','Pescoço / cervical']},'Pilates: puxada sentada com elástico':{family:'row',care:['Coluna']}
};
Object.entries(mfExistingExerciseMetadata).forEach(([name,metadata])=>{const exercise=exercises.find(item=>item.name===name);if(exercise)Object.assign(exercise,metadata)});
const mfExpandedExerciseCatalog=[
 /* Calistenia: 55 opções no total, incluindo apoios e barras marcados no check-in. */
 mfCatalogExercise('Flexão na parede','Calistenia','Parede','Peito · tríceps','3 séries · 10–15 repetições','push'),
 mfCatalogExercise('Flexão com joelhos apoiados','Calistenia','Colchonete','Peito · tríceps · core','3 séries · 8–12 repetições','push'),
 mfCatalogExercise('Flexão com pegada aberta','Calistenia','Peso corporal','Peito · ombros','3 séries · 8–12 repetições','push'),
 mfCatalogExercise('Flexão com pegada fechada','Calistenia','Peso corporal','Tríceps · peito','3 séries · 6–10 repetições','push'),
 mfCatalogExercise('Flexão com pausa no fundo','Calistenia','Peso corporal','Peito · tríceps · controle','3 séries · 6–10 repetições','push'),
 mfCatalogExercise('Flexão arqueiro assistida','Calistenia','Peso corporal','Peito · tríceps · ombros','3 séries · 5–8 por lado','push'),
 mfCatalogExercise('Flexão arqueiro','Calistenia','Peso corporal','Peito · tríceps · ombros','3 séries · 4–8 por lado','push'),
 mfCatalogExercise('Flexão pike','Calistenia','Peso corporal','Ombros · tríceps','3 séries · 6–10 repetições','shoulder'),
 mfCatalogExercise('Flexão pike com pés elevados','Calistenia','Cadeira firme','Ombros · tríceps','3 séries · 5–8 repetições','shoulder',['Ombro'],'Use cadeira firme, encostada na parede, e pare se sentir pressão no pescoço ou ombro.'),
 mfCatalogExercise('Flexão em parada de mão na parede','Calistenia','Parede','Ombros · tríceps · core','3 séries · 3–6 repetições','shoulder',['Ombro','Pescoço / cervical'],'Progressão avançada. Faça apenas com parede livre, sem dor no pescoço/ombro e, se possível, com supervisão.'),
 mfCatalogExercise('Flexão hindu','Calistenia','Peso corporal','Ombros · peito · mobilidade','3 séries · 6–10 repetições','push',['Ombro']),
 mfCatalogExercise('Flexão explosiva','Calistenia','Peso corporal','Peito · tríceps · potência','3 séries · 4–8 repetições','push',['Punho','Ombro'],'Exercício de impacto para punhos e ombros; mantenha somente se estiver sem dor e dominar a flexão comum.'),
 mfCatalogExercise('Depressão escapular na barra','Calistenia','Barra fixa','Costas · controle escapular','3 séries · 6–10 repetições','pull',['Ombro','Pescoço / cervical']),
 mfCatalogExercise('Sustentação ativa na barra','Calistenia','Barra fixa','Costas · pegada · ombros','3 séries · 10–20 segundos','pull',['Ombro']),
 mfCatalogExercise('Negativa de barra fixa','Calistenia','Barra fixa','Costas · bíceps','3 séries · 3–5 repetições lentas','pull'),
 mfCatalogExercise('Barra fixa pronada','Calistenia','Barra fixa','Costas · bíceps','3 séries · 4–8 repetições','pull'),
 mfCatalogExercise('Barra fixa supinada','Calistenia','Barra fixa','Costas · bíceps','3 séries · 4–8 repetições','pull'),
 mfCatalogExercise('Barra fixa com pegada neutra','Calistenia','Barra fixa','Costas · bíceps','3 séries · 4–8 repetições','pull'),
 mfCatalogExercise('Remada australiana supinada','Calistenia','Barra fixa','Costas · bíceps','3 séries · 8–12 repetições','pull'),
 mfCatalogExercise('Remada australiana com pés elevados','Calistenia','Barra fixa','Costas · bíceps · core','3 séries · 6–10 repetições','pull',[],'Eleve os pés apenas em apoio baixo, firme e que não deslize. Nunca use mesa, porta ou móvel instável como barra.'),
 mfCatalogExercise('Agachamento sumô','Calistenia','Peso corporal','Pernas · glúteos','3 séries · 10–15 repetições','squat',['Joelho']),
 mfCatalogExercise('Agachamento com pausa','Calistenia','Peso corporal','Pernas · glúteos · controle','3 séries · 8–12 repetições','squat',['Joelho']),
 mfCatalogExercise('Afundo reverso','Calistenia','Peso corporal','Pernas · glúteos','3 séries · 8–10 por lado','lunge',['Joelho']),
 mfCatalogExercise('Afundo lateral','Calistenia','Peso corporal','Adutores · glúteos · pernas','3 séries · 6–10 por lado','lunge',['Joelho']),
 mfCatalogExercise('Agachamento dividido','Calistenia','Peso corporal','Pernas · glúteos','3 séries · 8–12 por lado','lunge',['Joelho']),
 mfCatalogExercise('Agachamento búlgaro','Calistenia','Cadeira firme','Pernas · glúteos','3 séries · 6–10 por lado','lunge',['Joelho'],'Use cadeira firme encostada na parede. Reduza amplitude se houver desconforto no joelho.'),
 mfCatalogExercise('Agachamento pistola assistido','Calistenia','Cadeira firme','Pernas · glúteos · equilíbrio','3 séries · 4–8 por lado','squat',['Joelho'],'Apoie-se apenas em estrutura firme. Não use cadeira com rodinhas ou apoio que deslize.'),
 mfCatalogExercise('Agachamento pistola','Calistenia','Peso corporal','Pernas · glúteos · equilíbrio','3 séries · 3–6 por lado','squat',['Joelho']),
 mfCatalogExercise('Shrimp squat assistido','Calistenia','Cadeira firme','Pernas · glúteos · equilíbrio','3 séries · 4–8 por lado','squat',['Joelho'],'Use apoio firme para equilíbrio e interrompa se o joelho perder alinhamento ou doer.'),
 mfCatalogExercise('Shrimp squat','Calistenia','Peso corporal','Pernas · glúteos · equilíbrio','3 séries · 3–6 por lado','squat',['Joelho']),
 mfCatalogExercise('Agachamento cossaco','Calistenia','Peso corporal','Adutores · glúteos · mobilidade','3 séries · 5–8 por lado','squat',['Joelho']),
 mfCatalogExercise('Agachamento com salto','Calistenia','Peso corporal','Pernas · potência','3 séries · 6–10 repetições','squat',['Joelho','Tornozelo'],'Exercício de impacto. Use somente sem dor em joelho/tornozelo e em piso firme, não escorregadio.'),
 mfCatalogExercise('Afundo com salto','Calistenia','Peso corporal','Pernas · potência','3 séries · 5–8 por lado','lunge',['Joelho','Tornozelo'],'Exercício de impacto; não é indicado em dia de dor no joelho ou tornozelo.'),
 mfCatalogExercise('Ponte de glúteos com marcha','Calistenia','Colchonete','Glúteos · core · estabilidade','3 séries · 8 por lado','bridge',['Lombar']),
 mfCatalogExercise('Elevação pélvica com apoio no sofá','Calistenia','Sofá firme (apoio)','Glúteos · posterior','3 séries · 8–12 repetições','bridge',['Lombar'],'Use apenas sofá firme, sem rodinhas e que não se mova. Mantenha a lombar confortável.'),
 mfCatalogExercise('Panturrilha no degrau','Calistenia','Degrau/escada','Panturrilha · tornozelo','3 séries · 10–15 repetições','calf',['Tornozelo','Panturrilha'],'Apoie uma mão na parede ou corrimão e use degrau seco, firme e sem risco de escorregar.'),
 mfCatalogExercise('Panturrilha unilateral','Calistenia','Peso corporal','Panturrilha · tornozelo','3 séries · 8–12 por lado','calf',['Tornozelo','Panturrilha']),
 mfCatalogExercise('Hollow hold','Calistenia','Colchonete','Core · controle lombar','3 séries · 15–30 segundos','core',['Lombar']),
 mfCatalogExercise('Hollow rock','Calistenia','Colchonete','Core · controle corporal','3 séries · 6–12 balanços','core',['Lombar']),
 mfCatalogExercise('Elevação de pernas deitado','Calistenia','Colchonete','Abdômen · quadril','3 séries · 8–12 repetições','core',['Lombar']),
 mfCatalogExercise('Abdominal reverso','Calistenia','Colchonete','Core · abdômen inferior','3 séries · 10–15 repetições','core',['Lombar']),
 mfCatalogExercise('Prancha bear','Calistenia','Colchonete','Core · ombros · quadril','3 séries · 15–30 segundos','core',['Lombar','Ombro']),
 mfCatalogExercise('Y-T-W em pronação','Calistenia','Colchonete','Costas · escápulas · postura','3 séries · 6–10 repetições lentas','pull',['Ombro','Pescoço / cervical']),
 mfCatalogExercise('Prancha reversa','Calistenia','Colchonete','Costas · glúteos · ombros','3 séries · 15–30 segundos','pull',['Ombro','Lombar']),
 /* Academia: 75 opções no total. */
 mfCatalogExercise('Supino reto com barra','Academia','Barra e anilhas','Peito · tríceps','3 séries · 8–12 repetições','push'),
 mfCatalogExercise('Supino inclinado com barra','Academia','Barra e anilhas','Peito superior · tríceps','3 séries · 8–12 repetições','push'),
 mfCatalogExercise('Supino inclinado com halteres','Academia','Halteres','Peito superior · tríceps','3 séries · 8–12 repetições','push'),
 mfCatalogExercise('Supino declinado com halteres','Academia','Halteres','Peito · tríceps','3 séries · 8–12 repetições','push'),
 mfCatalogExercise('Chest press articulado','Academia','Máquinas','Peito · tríceps','3 séries · 10–12 repetições','push'),
 mfCatalogExercise('Peck deck','Academia','Máquinas','Peito','3 séries · 10–15 repetições','push'),
 mfCatalogExercise('Crossover alto para baixo','Academia','Cabo/polia','Peito','3 séries · 10–15 repetições','push'),
 mfCatalogExercise('Crossover baixo para alto','Academia','Cabo/polia','Peito superior','3 séries · 10–15 repetições','push'),
 mfCatalogExercise('Crucifixo com halteres','Academia','Halteres','Peito','3 séries · 10–15 repetições','push',['Ombro']),
 mfCatalogExercise('Pullover no cabo','Academia','Cabo/polia','Peito · costas','3 séries · 10–12 repetições','pull',['Ombro']),
 mfCatalogExercise('Puxada frontal pegada aberta','Academia','Cabo/polia','Costas · bíceps','3 séries · 8–12 repetições','pull'),
 mfCatalogExercise('Puxada frontal supinada','Academia','Cabo/polia','Costas · bíceps','3 séries · 8–12 repetições','pull'),
 mfCatalogExercise('Puxada frontal pegada neutra','Academia','Cabo/polia','Costas · bíceps','3 séries · 8–12 repetições','pull'),
 mfCatalogExercise('Puxada unilateral no cabo','Academia','Cabo/polia','Costas · bíceps','3 séries · 10–12 por lado','pull'),
 mfCatalogExercise('Remada articulada','Academia','Máquinas','Costas · bíceps','3 séries · 8–12 repetições','row'),
 mfCatalogExercise('Remada unilateral no cabo','Academia','Cabo/polia','Costas · bíceps','3 séries · 10–12 por lado','row'),
 mfCatalogExercise('Remada cavalinho','Academia','Barra e anilhas','Costas · bíceps','3 séries · 8–12 repetições','row',['Lombar']),
 mfCatalogExercise('Remada curvada com barra','Academia','Barra e anilhas','Costas · bíceps','3 séries · 8–12 repetições','row',['Lombar']),
 mfCatalogExercise('Remada curvada com halteres','Academia','Halteres','Costas · bíceps','3 séries · 8–12 repetições','row',['Lombar']),
 mfCatalogExercise('Pulldown com braços estendidos','Academia','Cabo/polia','Costas · core','3 séries · 10–15 repetições','pull'),
 mfCatalogExercise('Crucifixo inverso na máquina','Academia','Máquinas','Costas · deltoide posterior','3 séries · 10–15 repetições','shoulder',['Ombro','Pescoço / cervical']),
 mfCatalogExercise('Remada alta no cabo','Academia','Cabo/polia','Costas · ombros','3 séries · 10–12 repetições','row',['Ombro']),
 mfCatalogExercise('Desenvolvimento na máquina','Academia','Máquinas','Ombros · tríceps','3 séries · 8–12 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Desenvolvimento sentado com halteres','Academia','Halteres','Ombros · tríceps','3 séries · 8–12 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Desenvolvimento Arnold','Academia','Halteres','Ombros · tríceps','3 séries · 8–12 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Elevação frontal com halteres','Academia','Halteres','Ombros','3 séries · 10–15 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Elevação frontal no cabo','Academia','Cabo/polia','Ombros','3 séries · 10–15 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Elevação lateral no cabo','Academia','Cabo/polia','Ombros','3 séries · 10–15 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Elevação lateral na máquina','Academia','Máquinas','Ombros','3 séries · 10–15 repetições','shoulder',['Ombro']),
 mfCatalogExercise('Rotação externa no cabo','Academia','Cabo/polia','Manguito rotador · ombro','3 séries · 12–15 por lado','shoulder',['Ombro']),
 mfCatalogExercise('Rosca alternada','Academia','Halteres','Bíceps','3 séries · 8–12 repetições','biceps'),
 mfCatalogExercise('Rosca martelo','Academia','Halteres','Bíceps · antebraço','3 séries · 8–12 repetições','biceps'),
 mfCatalogExercise('Rosca Scott na máquina','Academia','Máquinas','Bíceps','3 séries · 10–12 repetições','biceps'),
 mfCatalogExercise('Rosca no cabo','Academia','Cabo/polia','Bíceps','3 séries · 10–15 repetições','biceps'),
 mfCatalogExercise('Rosca concentração','Academia','Halteres','Bíceps','3 séries · 10–12 por lado','biceps'),
 mfCatalogExercise('Rosca inversa','Academia','Barra e anilhas','Bíceps · antebraço','3 séries · 10–12 repetições','biceps'),
 mfCatalogExercise('Tríceps corda na polia','Academia','Cabo/polia','Tríceps','3 séries · 10–15 repetições','triceps'),
 mfCatalogExercise('Tríceps francês com halter','Academia','Halteres','Tríceps','3 séries · 8–12 repetições','triceps',['Ombro']),
 mfCatalogExercise('Tríceps testa com barra','Academia','Barra e anilhas','Tríceps','3 séries · 8–12 repetições','triceps',['Ombro']),
 mfCatalogExercise('Tríceps coice','Academia','Halteres','Tríceps','3 séries · 10–15 repetições','triceps'),
 mfCatalogExercise('Tríceps unilateral no cabo','Academia','Cabo/polia','Tríceps','3 séries · 10–15 por lado','triceps'),
 mfCatalogExercise('Agachamento no smith','Academia','Máquinas','Pernas · glúteos','3 séries · 8–12 repetições','squat',['Joelho']),
 mfCatalogExercise('Hack squat','Academia','Máquinas','Pernas · glúteos','3 séries · 8–12 repetições','squat',['Joelho']),
 mfCatalogExercise('Leg press 45 graus','Academia','Máquinas','Pernas · glúteos','3 séries · 10–15 repetições','squat',['Joelho']),
 mfCatalogExercise('Leg press horizontal','Academia','Máquinas','Pernas · glúteos','3 séries · 10–15 repetições','squat',['Joelho']),
 mfCatalogExercise('Agachamento goblet','Academia','Halteres','Pernas · glúteos','3 séries · 10–15 repetições','squat',['Joelho']),
 mfCatalogExercise('Cadeira extensora unilateral','Academia','Máquinas','Quadríceps','3 séries · 10–12 por lado','knee-extension',['Joelho']),
 mfCatalogExercise('Cadeira flexora sentada','Academia','Máquinas','Posterior de coxa','3 séries · 10–12 repetições','hamstrings'),
 mfCatalogExercise('Mesa flexora unilateral','Academia','Máquinas','Posterior de coxa','3 séries · 10–12 por lado','hamstrings'),
 mfCatalogExercise('Stiff com barra','Academia','Barra e anilhas','Posterior · glúteos','3 séries · 8–12 repetições','hinge',['Lombar']),
 mfCatalogExercise('Stiff com halteres','Academia','Halteres','Posterior · glúteos','3 séries · 8–12 repetições','hinge',['Lombar']),
 mfCatalogExercise('Levantamento terra sumô','Academia','Barra e anilhas','Pernas · glúteos · posterior','3 séries · 6–10 repetições','hinge',['Lombar']),
 mfCatalogExercise('Cadeira adutora','Academia','Máquinas','Adutores','3 séries · 12–15 repetições','hip'),
 mfCatalogExercise('Coice de glúteo na máquina','Academia','Máquinas','Glúteos','3 séries · 10–15 por lado','bridge'),
 mfCatalogExercise('Coice de glúteo no cabo','Academia','Cabo/polia','Glúteos','3 séries · 10–15 por lado','bridge'),
 mfCatalogExercise('Leg press unilateral','Academia','Máquinas','Pernas · glúteos','3 séries · 8–12 por lado','squat',['Joelho']),
 mfCatalogExercise('Panturrilha em pé na máquina','Academia','Máquinas','Panturrilha','3 séries · 10–15 repetições','calf',['Tornozelo','Panturrilha']),
 mfCatalogExercise('Panturrilha sentada na máquina','Academia','Máquinas','Panturrilha','3 séries · 10–15 repetições','calf',['Tornozelo','Panturrilha']),
 mfCatalogExercise('Bom dia no smith','Academia','Máquinas','Posterior · glúteos · lombar','3 séries · 8–12 repetições','hinge',['Lombar']),
 mfCatalogExercise('Abdominal no cabo','Academia','Cabo/polia','Core · abdômen','3 séries · 10–15 repetições','core',['Lombar']),
 mfCatalogExercise('Woodchop no cabo','Academia','Cabo/polia','Core · oblíquos','3 séries · 10–12 por lado','core',['Lombar']),
 mfCatalogExercise('Hiperextensão no banco','Academia','Banco','Glúteos · posterior · coluna','3 séries · 8–12 repetições','hinge',['Coluna','Lombar']),
 /* Pilates em casa: 45 opções no total, com elásticos e acessórios de Pilates. */
 mfCatalogExercise('Roll up assistido','Pilates em casa','Colchonete','Core · mobilidade da coluna','2 séries · 6–8 repetições','core',['Coluna','Lombar']),
 mfCatalogExercise('Half roll back','Pilates em casa','Colchonete','Core · controle da coluna','2 séries · 6–10 repetições','core',['Coluna','Lombar']),
 mfCatalogExercise('Saw (serrote)','Pilates em casa','Colchonete','Rotação torácica · posterior','2 séries · 6 por lado','spine-mobility',['Coluna','Lombar']),
 mfCatalogExercise('Spine twist sentado','Pilates em casa','Colchonete','Coluna torácica · postura','2 séries · 6 por lado','spine-mobility',['Coluna','Pescoço / cervical']),
 mfCatalogExercise('Série de chutes laterais','Pilates em casa','Colchonete','Glúteos · quadril','3 séries · 10 por lado','hip',['Joelho']),
 mfCatalogExercise('Teaser preparatório','Pilates em casa','Colchonete','Core · controle corporal','2 séries · 5–8 repetições','core',['Lombar']),
 mfCatalogExercise('Ponte de ombros unilateral','Pilates em casa','Colchonete','Glúteos · core · posterior','3 séries · 6–10 por lado','bridge',['Lombar','Joelho']),
 /* Diástase permanece como modalidade própria, com progressão suave. */
 mfCatalogExercise('Marcha supina com ativação','Diástase','Colchonete','Core profundo · estabilidade pélvica','2 séries · 6–8 por lado','diastasis',['Lombar']),
 mfCatalogExercise('Bent knee fallout controlado','Diástase','Colchonete','Core profundo · controle pélvico','2 séries · 6–8 por lado','diastasis',['Lombar']),
 mfCatalogExercise('Quadrupedia com ativação suave','Diástase','Colchonete','Core profundo · coluna','2 séries · 6–8 respirações','diastasis',['Coluna','Lombar']),
 mfCatalogExercise('Pressão de parede com expiração','Diástase','Parede','Core profundo · coordenação respiratória','2 séries · 6–10 repetições','diastasis',['Ombro']),
 mfCatalogExercise('Sentar e levantar com expiração','Diástase','Cadeira firme','Pernas · core profundo','2 séries · 6–10 repetições','diastasis',['Joelho','Lombar'],'Use cadeira firme, encostada na parede. Pare se houver abaulamento abdominal ou dor.'),
 mfCatalogExercise('Dead bug de calcanhar no solo','Diástase','Colchonete','Core profundo · estabilidade','2 séries · 6 por lado','diastasis',['Lombar'])
];
mfExpandedExerciseCatalog.forEach(item=>{if(!exercises.some(existing=>existing.name===item.name))exercises.push(item)});
const equipmentSwaps={
 'Flexão de braço':[{name:'Flexão de braço',equip:'Peso corporal',detail:'3 séries · 8–12 repetições'},{name:'Supino com halteres',equip:'Halteres',detail:'3 séries · 8–12 repetições'},{name:'Supino na máquina',equip:'Máquinas',detail:'3 séries · 10–12 repetições'},{name:'Flexão inclinada',equip:'Banco',detail:'3 séries · 10–15 repetições'}],
 'Agachamento controlado':[{name:'Agachamento controlado',equip:'Peso corporal',detail:'3 séries · 12 repetições'},{name:'Leg press',equip:'Máquinas',detail:'3 séries · 10–12 repetições'},{name:'Afundo alternado',equip:'Peso corporal',detail:'3 séries · 10 por lado'},{name:'Subida no banco',equip:'Banco',detail:'3 séries · 10 por lado'}],
 'Remada baixa':[{name:'Remada baixa',equip:'Cabo/polia',detail:'3 séries · 10–12 repetições'},{name:'Remada australiana',equip:'Barra fixa',detail:'3 séries · 8–12 repetições'},{name:'Remada com elástico',equip:'Elásticos',detail:'3 séries · 12 repetições'}],
 'Puxada frontal':[{name:'Puxada frontal',equip:'Máquinas',detail:'3 séries · 10 repetições'},{name:'Barra fixa assistida',equip:'Barra fixa',detail:'3 séries · 5–8 repetições'},{name:'Puxada com elástico',equip:'Elásticos',detail:'3 séries · 12 repetições'}],
 'Elevação de quadril':[{name:'Elevação de quadril',equip:'Peso corporal',detail:'3 séries · 12–15 repetições'},{name:'Elevação pélvica com barra',equip:'Barra e anilhas',detail:'3 séries · 8–12 repetições'},{name:'Ponte de glúteos unilateral',equip:'Colchonete',detail:'3 séries · 8 por lado'}],
 'Prancha frontal':[{name:'Prancha frontal',equip:'Colchonete',detail:'3 séries · 20–40 segundos'},{name:'Dead bug',equip:'Colchonete',detail:'3 séries · 8 por lado'},{name:'Bird dog',equip:'Colchonete',detail:'3 séries · 8 por lado'}]
};
const recipes=[
['🥞','Panqueca de banana e aveia','Café da manhã','10 min','1 banana, 1 ovo, 2 colheres de aveia e canela','Amasse a banana, misture tudo e doure dos dois lados em frigideira antiaderente.','280 kcal'],['🍳','Omelete colorida','Café da manhã','12 min','2 ovos, tomate, espinafre, cebola e queijo branco','Refogue os vegetais, junte os ovos batidos e cozinhe tampado.','290 kcal'],['🥣','Overnight oats de morango','Café da manhã','5 min + geladeira','Aveia, iogurte natural, leite, chia e morangos','Misture em um pote e deixe na geladeira de um dia para o outro.','320 kcal'],['🍠','Tapioca com frango','Café da manhã','15 min','Goma de tapioca, frango desfiado e requeijão light','Prepare a tapioca na frigideira e recheie com o frango temperado.','310 kcal'],['🍞','Torrada com ricota temperada e ovo','Café da manhã','10 min','Torradas integrais, ricota, 1 ovo, tomate e ervas','Tempere a ricota, cubra as torradas e finalize com ovo.','310 kcal'],['🍌','Vitamina proteica','Café da manhã','5 min','Banana, leite, aveia, pasta de amendoim e canela','Bata todos os ingredientes até ficar cremosa.','360 kcal'],['🧀','Cuscuz com queijo branco','Café da manhã','12 min','Flocão de milho, água, queijo branco e orégano','Hidrate o flocão, cozinhe na cuscuzeira e sirva com queijo.','290 kcal'],['🫓','Crepioca de ricota','Café da manhã','10 min','1 ovo, goma de tapioca, ricota e tomate','Misture ovo e goma, doure e recheie com ricota temperada.','270 kcal'],
['🥗','Bowl de frango completo','Hipertrofia','20 min','Frango grelhado, arroz, feijão, folhas, cenoura e azeite','Monte o prato com metade de vegetais, uma porção de arroz, feijão e frango.','520 kcal'],['🍝','Macarrão de atum','Hipertrofia','15 min','Macarrão integral, atum, tomate, alho e ervilhas','Cozinhe a massa e misture ao molho rápido de tomate e atum.','490 kcal'],['🍚','Arroz, feijão e carne','Hipertrofia','25 min','Arroz, feijão, patinho moído, abóbora e salada','Sirva as porções prontas com a salada e abóbora assada.','540 kcal'],['🐟','Salmão com batata doce','Hipertrofia','30 min','Salmão, batata-doce, brócolis, limão e ervas','Asse o salmão e a batata; cozinhe o brócolis no vapor.','560 kcal'],['🌯','Wrap proteico de frango','Hipertrofia','15 min','Tortilha integral, frango, cottage, alface e cenoura','Recheie a tortilha e aqueça rapidamente na frigideira.','410 kcal'],['🥩','Carne com purê de mandioquinha','Hipertrofia','30 min','Patinho em tiras, mandioquinha, leite e vagem','Faça o purê e grelhe a carne com a vagem.','500 kcal'],['🍛','Frango cremoso com arroz','Hipertrofia','25 min','Frango, arroz, milho, iogurte natural e páprica','Misture o frango já cozido ao molho de iogurte e sirva com arroz.','470 kcal'],['🫔','Escondidinho de frango','Hipertrofia','35 min','Frango desfiado, batata, tomate, cebola e queijo','Cubra o frango temperado com purê e leve para gratinar.','480 kcal'],
['🍅','Salada caprese com massa','Vegetariana','15 min','Macarrão, muçarela, tomate, manjericão e azeite','Misture a massa cozida aos ingredientes frescos e tempere na hora.','390 kcal'],['🫘','Bowl vegetariano brasileiro','Vegetariana','25 min','Arroz integral, feijão, abóbora, couve e sementes','Monte o bowl com todos os alimentos aquecidos.','440 kcal'],['🍆','Berinjela recheada com ricota','Vegetariana','35 min','Berinjela, ricota, tomate, cebola e muçarela','Asse a berinjela, recheie com ricota temperada e gratine.','360 kcal'],['🌮','Tacos de feijão','Vegetariana','20 min','Tortilhas, feijão preto, milho, tomate, alface e abacate','Aqueça as tortilhas e recheie com o feijão temperado.','400 kcal'],['🍄','Risoto cremoso de cogumelos','Vegetariana','30 min','Arroz arbóreo, cogumelos, parmesão, cebola e caldo','Cozinhe o arroz aos poucos com caldo e finalize com cogumelos e queijo.','430 kcal'],['🍚','Arroz de forno com brócolis e queijo','Vegetariana','30 min','Arroz, brócolis, queijo, ovos e tomate','Misture os ingredientes e asse até dourar.','410 kcal'],['🥘','Estrogonofe de palmito e cogumelos','Vegetariana','25 min','Palmito, cogumelos, molho de tomate, creme de leite e arroz','Cozinhe o molho cremoso e sirva com arroz.','450 kcal'],['🍕','Pizza de frigideira vegetal','Vegetariana','15 min','Pão sírio, molho de tomate, muçarela, tomate e rúcula','Monte no pão sírio, aqueça tampado e finalize com rúcula.','340 kcal'],['🍝','Macarrão ao pesto de espinafre','Vegetariana','20 min','Macarrão, espinafre, manjericão, parmesão e castanhas','Bata o pesto e misture à massa cozida.','420 kcal'],['🥒','Lasanha de abobrinha e ricota','Vegetariana','40 min','Abobrinha, ricota, molho de tomate e muçarela','Monte camadas e asse até gratinar.','380 kcal'],['🍳','Shakshuka de ovos e tomate','Vegetariana','20 min','Ovos, tomate, pimentão, cebola e páprica','Cozinhe os ovos no molho de tomate temperado.','330 kcal'],['🥧','Quiche de espinafre e queijo','Vegetariana','35 min','Ovos, espinafre, queijo e massa integral','Asse até o recheio firmar e dourar.','390 kcal'],['🍲','Escondidinho de cogumelos','Vegetariana','35 min','Cogumelos, batata, leite e queijo','Cubra os cogumelos com purê e gratine.','410 kcal'],['🎃','Nhoque de abóbora com sálvia','Vegetariana','35 min','Nhoque de abóbora, manteiga, sálvia e parmesão','Doure o nhoque e finalize com ervas e queijo.','440 kcal'],['🥞','Panqueca salgada de espinafre','Vegetariana','25 min','Ovo, aveia, espinafre, ricota e tomate','Faça a massa, recheie e aqueça na frigideira.','350 kcal'],['🍜','Yakisoba de legumes e omelete','Vegetariana','25 min','Macarrão, ovos, brócolis, cenoura e shoyu','Salteie os legumes, prepare omelete em tiras e misture ao macarrão.','430 kcal'],
['🥒','Abobrinha recheada leve','Emagrecimento','30 min','Abobrinha, frango desfiado, tomate, cottage e ervas','Asse a abobrinha recheada até ficar macia.','290 kcal'],['🥗','Salada de atum e feijão branco','Emagrecimento','15 min','Atum, feijão branco, folhas, tomate, cebola e limão','Misture todos os ingredientes e tempere na hora.','330 kcal'],['🍜','Sopa de legumes com frango','Emagrecimento','30 min','Frango, abóbora, cenoura, chuchu, couve e caldo caseiro','Cozinhe os legumes e acrescente o frango desfiado no final.','280 kcal'],['🐟','Peixe com legumes assados','Emagrecimento','30 min','Filé de peixe, abobrinha, cenoura, cebola e limão','Asse tudo junto com ervas e pouco azeite.','310 kcal'],['🥦','Frango com brócolis','Emagrecimento','20 min','Frango em cubos, brócolis, alho, gengibre e shoyu light','Salteie o frango e os vegetais em fogo alto.','300 kcal'],['🍳','Ovos mexidos mediterrâneos','Emagrecimento','12 min','2 ovos, tomate, espinafre, cebola e azeitonas','Refogue os vegetais e acrescente os ovos mexidos.','260 kcal'],['🥬','Rolinho de alface com carne','Emagrecimento','20 min','Patinho moído, alface, cenoura, pepino e molho de iogurte','Recheie as folhas com carne e vegetais crocantes.','320 kcal'],['🍛','Moqueca leve de peixe','Emagrecimento','30 min','Peixe, tomate, pimentão, leite de coco light e coentro','Cozinhe em panela tampada e sirva com couve-flor.','340 kcal'],
['🍓','Iogurte proteico com frutas','Lanche','5 min','Iogurte grego natural, morango, banana e granola','Monte tudo em um pote e consuma gelado.','240 kcal'],['🍫','Mousse de cacau e banana','Lanche','10 min','Banana congelada, cacau, iogurte e pasta de amendoim','Bata até virar creme e leve à geladeira.','260 kcal'],['🍎','Maçã com pasta de amendoim','Lanche','3 min','1 maçã, pasta de amendoim e canela','Fatie a maçã e sirva com a pasta por cima.','220 kcal'],['🧁','Muffin de aveia','Lanche','25 min','Ovo, banana, aveia, cacau e fermento','Misture, distribua em forminhas e asse até firmar.','190 kcal'],['🍿','Pipoca temperada','Lanche','10 min','Milho de pipoca, páprica, sal e ervas','Estoure sem excesso de óleo e tempere.','150 kcal'],['🥕','Palitos com homus','Lanche','8 min','Cenoura, pepino, grão-de-bico, tahine e limão','Bata o homus e sirva com os vegetais cortados.','210 kcal'],['🍪','Cookie de banana e aveia','Lanche','20 min','Banana madura, aveia, uva-passa e canela','Modele colheradas e asse até dourar levemente.','180 kcal'],['🍨','Sorvete rápido de frutas','Lanche','5 min','Banana congelada, manga congelada e iogurte','Processe as frutas até ficarem cremosas.','200 kcal'],
['🍝','Macarrão alho e tomate','Baixo custo','20 min','Macarrão, tomate, alho, cebola e cheiro-verde','Faça molho simples com tomate e misture à massa.','390 kcal'],['🍳','Arroz de forno econômico','Baixo custo','25 min','Arroz pronto, ovos, milho, cenoura e queijo','Misture tudo e leve ao forno até aquecer e gratinar.','410 kcal'],['🫘','Feijão tropeiro leve','Baixo custo','25 min','Feijão, ovos, couve, farinha de mandioca e cebola','Refogue os ingredientes e use pouca farinha.','370 kcal'],['🥔','Batata recheada de atum','Baixo custo','25 min','Batata, atum, milho, iogurte e cheiro-verde','Asse a batata, abra e recheie com a mistura de atum.','350 kcal'],['🍛','Lentilha com arroz','Baixo custo','30 min','Lentilha, arroz, cenoura, alho e cebola','Cozinhe a lentilha bem temperada e sirva com arroz.','380 kcal'],['🥪','Sanduíche de ovo cremoso','Baixo custo','10 min','Pão integral, ovos, iogurte, cenoura e alface','Amasse os ovos cozidos com iogurte e monte o sanduíche.','310 kcal'],['🌽','Cuscuz com ovo','Baixo custo','15 min','Flocão de milho, ovo, tomate e queijo opcional','Cozinhe o cuscuz e sirva com ovo mexido e tomate.','300 kcal'],['🍌','Bolo de caneca de banana','Baixo custo','5 min','Banana, aveia, ovo, canela e fermento','Amasse, misture e cozinhe no micro-ondas por cerca de 2 minutos.','250 kcal']
];
const recipeDetails={
 'Panqueca de banana e aveia':{ingredients:['1 banana-prata madura pequena','1 ovo','2 colheres (sopa) de aveia em flocos finos','1 pitada de canela','1 colher (chá) de óleo ou manteiga para untar'],steps:['Amasse a banana em uma tigela e misture o ovo, a aveia e a canela até ficar homogêneo.','Aqueça uma frigideira antiaderente em fogo baixo e unte levemente.','Coloque a massa, cozinhe por 2 minutos, vire com cuidado e doure o outro lado por mais 1 a 2 minutos.']},
 'Omelete colorida':{ingredients:['2 ovos','1 colher (sopa) de água','½ tomate pequeno em cubos','1 xícara de espinafre picado','1 colher (sopa) de cebola picada','30 g de queijo branco em cubos','1 colher (chá) de azeite'],steps:['Bata os ovos com a água, uma pitada de sal e pimenta.','Aqueça o azeite em frigideira pequena, refogue a cebola, o tomate e o espinafre por 2 minutos.','Despeje os ovos, espalhe o queijo, tampe e cozinhe em fogo baixo até firmar. Dobre e sirva.']},
 'Overnight oats de morango':{ingredients:['4 colheres (sopa) de aveia','170 g de iogurte natural','¼ de xícara de leite','1 colher (chá) de chia','5 morangos fatiados','1 colher (chá) de mel, opcional'],steps:['Misture a aveia, o iogurte, o leite e a chia em um pote com tampa.','Junte metade dos morangos e o mel, se usar.','Tampe e deixe na geladeira por pelo menos 6 horas. Finalize com os morangos restantes antes de comer.']},
 'Tapioca com frango':{ingredients:['3 colheres (sopa) de goma de tapioca hidratada','½ xícara de frango cozido e desfiado','1 colher (sopa) de requeijão light ou cottage','1 colher (sopa) de tomate picado','Orégano e cheiro-verde a gosto'],steps:['Misture o frango com o requeijão, tomate, orégano e cheiro-verde.','Aqueça uma frigideira antiaderente e espalhe a goma em camada uniforme.','Quando os grãos unirem, coloque o recheio em metade da tapioca, dobre e aqueça por mais 1 minuto.']},
 'Torrada com ricota temperada e ovo':{ingredients:['2 torradas integrais','4 colheres (sopa) de ricota amassada','1 ovo','1 colher (sopa) de tomate picado','Orégano, sal e pimenta a gosto'],steps:['Misture a ricota com tomate, orégano, sal e pimenta.','Cozinhe o ovo por 7 minutos ou prepare-o mexido.','Espalhe a ricota nas torradas e finalize com o ovo e ervas.']},
 'Vitamina proteica':{ingredients:['1 banana congelada','200 ml de leite ou bebida vegetal','2 colheres (sopa) de aveia','1 colher (sopa) de pasta de amendoim','1 colher (chá) de cacau ou canela'],steps:['Coloque todos os ingredientes no liquidificador.','Bata por 40 a 60 segundos, até ficar cremoso.','Sirva imediatamente; se quiser mais líquido, acrescente 2 colheres de sopa de água ou leite.']},
 'Cuscuz com queijo branco':{ingredients:['½ xícara de flocão de milho','¼ de xícara de água','1 pitada de sal','40 g de queijo branco em cubos','Orégano a gosto'],steps:['Misture o flocão, a água e o sal; deixe hidratar por 5 minutos.','Coloque em cuscuzeira sem apertar e cozinhe por 7 a 8 minutos após a água ferver.','Desenforme, acrescente o queijo e o orégano; tampe por 1 minuto para aquecer o recheio.']},
 'Crepioca de ricota':{ingredients:['1 ovo','2 colheres (sopa) de goma de tapioca','3 colheres (sopa) de ricota amassada','1 colher (sopa) de tomate picado','Orégano e sal a gosto'],steps:['Misture o ovo e a tapioca com um garfo.','Despeje em frigideira antiaderente aquecida e cozinhe em fogo baixo até soltar; vire.','Recheie com ricota, tomate e orégano, dobre e aqueça por mais 1 minuto.']},
 'Bowl de frango completo':{ingredients:['100 g de peito de frango em cubos','½ xícara de arroz cozido','⅓ de xícara de feijão cozido','1 xícara de folhas','½ cenoura ralada','1 colher (chá) de azeite','Limão, alho e sal a gosto'],steps:['Tempere o frango com limão, alho e sal e grelhe até dourar por completo.','Aqueça o arroz e o feijão separadamente.','Monte o bowl com folhas, cenoura, arroz, feijão e frango; regue com azeite.']},
 'Macarrão de atum':{ingredients:['70 g de macarrão integral seco','1 lata pequena de atum em água escorrido','1 tomate médio picado','1 dente de alho picado','¼ de xícara de ervilhas','1 colher (chá) de azeite'],steps:['Cozinhe o macarrão em água e sal até ficar al dente; reserve ¼ de xícara da água do cozimento.','Refogue alho e tomate no azeite por 3 minutos; acrescente ervilhas e atum.','Misture o macarrão ao molho, usando um pouco da água reservada se necessário.']},
 'Arroz, feijão e carne':{ingredients:['100 g de patinho moído','½ xícara de arroz cozido','⅓ de xícara de feijão cozido','½ xícara de abóbora em cubos','1 xícara de salada verde','1 colher (chá) de azeite'],steps:['Asse a abóbora a 200 °C por 20 minutos com azeite, sal e ervas.','Refogue o patinho com cebola, alho e tomate até cozinhar totalmente.','Sirva arroz, feijão, carne, abóbora e salada no mesmo prato.']},
 'Salmão com batata doce':{ingredients:['120 g de filé de salmão','1 batata-doce pequena em cubos','1 xícara de brócolis','1 colher (chá) de azeite','Suco de ½ limão','Sal e ervas a gosto'],steps:['Tempere o salmão com limão, sal e ervas.','Asse a batata com metade do azeite a 200 °C por 20 minutos; junte o salmão e asse por mais 12 minutos.','Cozinhe o brócolis no vapor por 4 minutos e sirva com o restante do azeite.']},
 'Wrap proteico de frango':{ingredients:['1 tortilha integral média','90 g de frango desfiado','2 colheres (sopa) de cottage','½ cenoura ralada','2 folhas de alface','1 colher (sopa) de milho, opcional'],steps:['Misture o frango e o cottage com uma pitada de páprica.','Aqueça a tortilha por 20 segundos de cada lado.','Distribua alface, cenoura, milho e o frango; enrole fechando as laterais e sirva.']},
 'Carne com purê de mandioquinha':{ingredients:['100 g de patinho em tiras','2 mandioquinhas pequenas','2 colheres (sopa) de leite','½ xícara de vagem','1 colher (chá) de azeite','Sal, alho e pimenta a gosto'],steps:['Cozinhe a mandioquinha até ficar macia; amasse com leite e sal.','Grelhe a carne em tiras no azeite com alho e pimenta.','Cozinhe a vagem no vapor por 5 minutos e sirva ao lado do purê e da carne.']},
 'Frango cremoso com arroz':{ingredients:['100 g de frango em cubos','½ xícara de arroz cozido','2 colheres (sopa) de iogurte natural','2 colheres (sopa) de milho','1 colher (chá) de páprica','1 colher (chá) de azeite'],steps:['Tempere o frango com páprica, sal e pimenta; doure no azeite até cozinhar.','Desligue o fogo e misture iogurte e milho para formar um molho cremoso sem ferver.','Sirva sobre o arroz aquecido, com cheiro-verde se desejar.']},
 'Escondidinho de frango':{ingredients:['120 g de frango desfiado','1 batata média cozida','¼ de tomate picado','1 colher (sopa) de cebola picada','1 colher (sopa) de leite','1 colher (sopa) de queijo ralado'],steps:['Amasse a batata com leite, sal e pimenta até formar um purê.','Refogue cebola, tomate e frango por 3 minutos.','Em um refratário pequeno, coloque o frango, cubra com purê e queijo; gratine por 8 minutos.']},
 'Salada caprese com massa':{ingredients:['70 g de macarrão curto seco','80 g de muçarela de búfala ou queijo minas em cubos','1 tomate médio em cubos','6 folhas de manjericão','1 colher (chá) de azeite','1 colher (chá) de vinagre balsâmico, opcional'],steps:['Cozinhe o macarrão em água e sal até ficar al dente; escorra e espere amornar.','Misture com tomate, muçarela e manjericão em uma tigela.','Tempere com azeite, vinagre, sal e pimenta pouco antes de servir.']},
 'Bowl vegetariano brasileiro':{ingredients:['½ xícara de arroz integral cozido','⅓ de xícara de feijão cozido','½ xícara de abóbora assada','½ xícara de couve fatiada','1 colher (sopa) de sementes de abóbora','1 colher (chá) de azeite'],steps:['Asse a abóbora em cubos a 200 °C por 20 minutos.','Refogue a couve rapidamente em uma frigideira com um pouco de azeite e alho.','Monte o bowl com arroz, feijão, abóbora, couve e sementes.']},
 'Berinjela recheada com ricota':{ingredients:['1 berinjela pequena','½ xícara de ricota amassada','1 tomate pequeno picado','2 colheres (sopa) de cebola picada','2 colheres (sopa) de muçarela ralada','1 colher (chá) de azeite'],steps:['Corte a berinjela ao meio, faça cortes na polpa, pincele azeite e asse por 20 minutos a 200 °C.','Retire parte da polpa e misture com ricota, tomate, cebola, sal e ervas.','Recheie as metades, cubra com queijo e asse por mais 8 minutos.']},
 'Tacos de feijão':{ingredients:['2 tortilhas pequenas','½ xícara de feijão preto cozido','2 colheres (sopa) de milho','2 colheres (sopa) de tomate picado','½ xícara de alface fatiada','2 colheres (sopa) de abacate amassado'],steps:['Amasse levemente o feijão com páprica, cominho e uma colher de sopa de água quente.','Aqueça as tortilhas em frigideira seca.','Recheie com feijão, milho, tomate, alface e abacate; sirva na hora.']},
 'Risoto cremoso de cogumelos':{ingredients:['⅓ de xícara de arroz arbóreo','1 xícara de cogumelos fatiados','2 colheres (sopa) de cebola picada','1 xícara de caldo de legumes quente','1 colher (sopa) de parmesão ralado','1 colher (chá) de azeite'],steps:['Refogue cebola e cogumelos no azeite até dourar; reserve metade dos cogumelos.','Junte o arroz e acrescente o caldo quente aos poucos, mexendo até ficar cremoso.','Desligue o fogo, misture parmesão, ajuste sal e finalize com os cogumelos reservados.']},
 'Arroz de forno com brócolis e queijo':{ingredients:['¾ de xícara de arroz cozido','½ xícara de brócolis picado e cozido','1 ovo','¼ de tomate picado','3 colheres (sopa) de queijo minas em cubos','1 colher (sopa) de leite','Orégano e sal a gosto'],steps:['Aqueça o forno a 200 °C e unte um refratário pequeno.','Misture arroz, brócolis, ovo batido, tomate, leite, queijo e orégano.','Leve ao forno por 15 minutos, até firmar e dourar nas bordas.']},
 'Estrogonofe de palmito e cogumelos':{ingredients:['½ xícara de palmito em rodelas','1 xícara de cogumelos fatiados','¼ de cebola em tiras','2 colheres (sopa) de molho de tomate','3 colheres (sopa) de creme de leite','½ xícara de arroz cozido','1 colher (chá) de azeite'],steps:['Refogue a cebola e os cogumelos no azeite até dourar.','Acrescente palmito e molho de tomate; cozinhe por 3 minutos.','Desligue o fogo, misture o creme de leite, ajuste os temperos e sirva com arroz.']},
 'Pizza de frigideira vegetal':{ingredients:['1 pão sírio pequeno','2 colheres (sopa) de molho de tomate','40 g de muçarela ralada','½ tomate em rodelas','½ xícara de rúcula','Orégano a gosto'],steps:['Aqueça uma frigideira antiaderente em fogo baixo e coloque o pão sírio.','Espalhe molho, queijo, tomate e orégano; tampe até derreter o queijo.','Desligue o fogo, acrescente a rúcula e sirva.']},
 'Macarrão ao pesto de espinafre':{ingredients:['70 g de macarrão seco','1 xícara de espinafre','6 folhas de manjericão','1 colher (sopa) de parmesão ralado','1 colher (sopa) de castanhas','1 colher (chá) de azeite','2 colheres (sopa) da água do cozimento'],steps:['Cozinhe o macarrão até ficar al dente e reserve a água do cozimento.','Bata espinafre, manjericão, parmesão, castanhas, azeite e água reservada até formar um molho.','Misture o pesto à massa quente e sirva com parmesão extra, se desejar.']},
 'Lasanha de abobrinha e ricota':{ingredients:['1 abobrinha média em lâminas','½ xícara de ricota amassada','½ xícara de molho de tomate','2 colheres (sopa) de muçarela ralada','1 colher (chá) de azeite','Orégano e sal a gosto'],steps:['Grelhe as lâminas de abobrinha em frigideira antiaderente por 1 minuto de cada lado.','Em refratário pequeno, alterne molho, abobrinha e ricota temperada.','Cubra com muçarela e asse a 200 °C por 15 minutos, até gratinar.']},
 'Shakshuka de ovos e tomate':{ingredients:['2 ovos','2 tomates médios picados','¼ de pimentão em cubos','2 colheres (sopa) de cebola picada','1 colher (chá) de azeite','½ colher (chá) de páprica','Cheiro-verde a gosto'],steps:['Refogue cebola e pimentão no azeite até amaciar.','Junte tomate, páprica, sal e pimenta; cozinhe por 8 minutos até formar molho encorpado.','Abra dois espaços no molho, coloque os ovos, tampe e cozinhe até as claras firmarem.']},
 'Quiche de espinafre e queijo':{ingredients:['1 ovo','½ xícara de espinafre picado','40 g de queijo minas em cubos','2 colheres (sopa) de leite','1 disco pequeno de massa integral ou 1 fatia de pão integral amassada','Noz-moscada e sal a gosto'],steps:['Aqueça o forno a 180 °C e acomode a massa em uma forminha untada.','Misture ovo, leite, espinafre, queijo, sal e noz-moscada.','Despeje sobre a massa e asse por 20 a 25 minutos, até firmar e dourar.']},
 'Escondidinho de cogumelos':{ingredients:['1 batata média cozida','1 xícara de cogumelos fatiados','¼ de cebola picada','2 colheres (sopa) de leite','1 colher (sopa) de queijo ralado','1 colher (chá) de azeite'],steps:['Amasse a batata com leite, sal e pimenta até formar purê.','Refogue cebola e cogumelos no azeite até dourarem e a água secar.','Coloque cogumelos em refratário, cubra com purê e queijo; gratine por 10 minutos.']},
 'Nhoque de abóbora com sálvia':{ingredients:['1 xícara de nhoque de abóbora pronto','1 colher (chá) de manteiga','4 folhas de sálvia ou orégano','1 colher (sopa) de parmesão ralado','1 colher (chá) de azeite'],steps:['Cozinhe o nhoque conforme a embalagem e escorra.','Aqueça manteiga e azeite em frigideira, junte sálvia e deixe perfumar por 30 segundos.','Adicione o nhoque, doure por 2 minutos e finalize com parmesão.']},
 'Panqueca salgada de espinafre':{ingredients:['1 ovo','3 colheres (sopa) de aveia','2 colheres (sopa) de água','½ xícara de espinafre picado','3 colheres (sopa) de ricota','1 colher (sopa) de tomate picado'],steps:['Bata ovo, aveia, água, espinafre e uma pitada de sal até ficar homogêneo.','Despeje em frigideira antiaderente e cozinhe em fogo baixo; vire quando soltar.','Recheie com ricota e tomate temperados, dobre e aqueça por mais 1 minuto.']},
 'Yakisoba de legumes e omelete':{ingredients:['70 g de macarrão para yakisoba','2 ovos','½ xícara de brócolis','½ cenoura em tiras','¼ de cebola em tiras','1 colher (sopa) de shoyu light','1 colher (chá) de óleo ou azeite'],steps:['Cozinhe o macarrão conforme a embalagem e escorra.','Faça uma omelete fina, corte em tiras e reserve.','Salteie cebola, cenoura e brócolis no óleo; junte macarrão, shoyu e as tiras de omelete por 1 minuto.']},
 'Abobrinha recheada leve':{ingredients:['1 abobrinha média','100 g de frango desfiado','2 colheres (sopa) de cottage','2 colheres (sopa) de tomate picado','1 colher (chá) de azeite','Ervas a gosto'],steps:['Corte a abobrinha ao meio, retire parte da polpa e asse por 15 minutos a 200 °C.','Misture frango, cottage, tomate, polpa picada e ervas.','Recheie, regue com azeite e asse por mais 10 minutos.']},
 'Salada de atum e feijão branco':{ingredients:['½ xícara de feijão branco cozido','1 lata pequena de atum em água escorrido','1 xícara de folhas','½ tomate em cubos','1 colher (sopa) de cebola roxa','Suco de ½ limão','1 colher (chá) de azeite'],steps:['Misture feijão branco, atum, tomate e cebola.','Acrescente as folhas apenas antes de servir.','Tempere com limão, azeite, sal e pimenta.']},
 'Sopa de legumes com frango':{ingredients:['100 g de frango desfiado','1 xícara de abóbora em cubos','½ cenoura em cubos','½ chuchu em cubos','1 folha de couve fatiada','2 xícaras de caldo caseiro ou água'],steps:['Cozinhe abóbora, cenoura e chuchu no caldo até ficarem macios.','Amasse alguns cubos de abóbora na própria panela para engrossar levemente.','Acrescente frango e couve, cozinhe por 2 minutos e ajuste os temperos.']},
 'Peixe com legumes assados':{ingredients:['120 g de filé de peixe branco','½ abobrinha em meias-luas','½ cenoura em tiras','¼ de cebola em pétalas','1 colher (chá) de azeite','Suco de ½ limão e ervas'],steps:['Tempere o peixe com limão, sal e ervas.','Espalhe legumes em assadeira, misture azeite e asse por 10 minutos a 200 °C.','Coloque o peixe sobre os legumes e asse por mais 12 minutos ou até cozinhar.']},
 'Frango com brócolis':{ingredients:['120 g de frango em cubos','1 xícara de brócolis','1 dente de alho picado','1 colher (chá) de gengibre ralado','1 colher (chá) de shoyu light','1 colher (chá) de azeite'],steps:['Doure o frango no azeite até ficar totalmente cozido.','Junte alho e gengibre por 30 segundos; acrescente brócolis com 2 colheres de sopa de água.','Tampe por 3 minutos, adicione shoyu e misture antes de servir.']},
 'Ovos mexidos mediterrâneos':{ingredients:['2 ovos','½ tomate picado','½ xícara de espinafre','1 colher (sopa) de cebola','4 azeitonas fatiadas','1 colher (chá) de azeite'],steps:['Refogue cebola, tomate e espinafre no azeite até murchar.','Bata os ovos com uma pitada de sal e despeje na frigideira.','Mexa delicadamente até ficar cremoso e finalize com azeitonas.']},
 'Rolinho de alface com carne':{ingredients:['100 g de patinho moído','4 folhas grandes de alface','¼ de cenoura ralada','¼ de pepino em tiras','2 colheres (sopa) de iogurte natural','1 colher (chá) de limão'],steps:['Refogue a carne com alho, sal e pimenta até cozinhar.','Misture iogurte com limão, sal e ervas para o molho.','Recheie as folhas de alface com carne, cenoura e pepino; finalize com o molho e enrole.']},
 'Moqueca leve de peixe':{ingredients:['120 g de filé de peixe em cubos','½ tomate em rodelas','¼ de pimentão em tiras','2 colheres (sopa) de leite de coco light','¼ de cebola em rodelas','Coentro e limão a gosto'],steps:['Monte em panela pequena camadas de cebola, tomate, pimentão e peixe temperado com limão.','Acrescente leite de coco e ¼ de xícara de água; cozinhe tampado por 10 minutos.','Finalize com coentro e sirva com couve-flor ou arroz.']},
 'Iogurte proteico com frutas':{ingredients:['170 g de iogurte grego natural','4 morangos fatiados','½ banana em rodelas','2 colheres (sopa) de granola sem açúcar','1 colher (chá) de chia'],steps:['Coloque o iogurte em uma tigela ou pote.','Distribua morangos, banana, granola e chia por cima.','Consuma na hora ou mantenha refrigerado por até 4 horas.']},
 'Mousse de cacau e banana':{ingredients:['1 banana congelada em rodelas','1 colher (sopa) de cacau em pó','2 colheres (sopa) de iogurte natural','1 colher (chá) de pasta de amendoim'],steps:['Coloque a banana congelada no processador e bata até quebrar em pedaços pequenos.','Junte cacau, iogurte e pasta de amendoim; processe até ficar cremoso.','Sirva na hora ou leve à geladeira por 20 minutos para ficar mais firme.']},
 'Maçã com pasta de amendoim':{ingredients:['1 maçã pequena','1 colher (sopa) rasa de pasta de amendoim sem açúcar','Canela a gosto'],steps:['Lave a maçã, retire o miolo e corte em fatias.','Distribua a pasta de amendoim sobre as fatias ou sirva em um potinho.','Polvilhe canela e consuma em seguida.']},
 'Muffin de aveia':{ingredients:['1 banana madura','1 ovo','3 colheres (sopa) de aveia','1 colher (chá) de cacau','½ colher (chá) de fermento','1 colher (chá) de óleo para untar'],steps:['Aqueça o forno a 180 °C e unte 2 forminhas de muffin.','Amasse a banana e misture ovo, aveia, cacau e fermento.','Divida nas forminhas e asse por 18 a 20 minutos, até firmar.']},
 'Pipoca temperada':{ingredients:['3 colheres (sopa) de milho de pipoca','1 colher (chá) de óleo','½ colher (chá) de páprica','Sal e ervas secas a gosto'],steps:['Aqueça o óleo em panela grande e coloque 3 grãos de milho.','Quando eles estourarem, junte o restante, tampe e mexa a panela de vez em quando.','Quando os estouros diminuírem, desligue e tempere com páprica, sal e ervas.']},
 'Palitos com homus':{ingredients:['1 cenoura pequena em palitos','½ pepino em palitos','½ xícara de grão-de-bico cozido','1 colher (chá) de tahine','Suco de ½ limão','½ dente de alho','2 colheres (sopa) de água'],steps:['Bata grão-de-bico, tahine, limão, alho, água e sal até ficar cremoso.','Ajuste a água aos poucos se precisar de uma textura mais lisa.','Sirva 3 colheres de sopa de homus com os palitos de cenoura e pepino.']},
 'Cookie de banana e aveia':{ingredients:['1 banana madura amassada','½ xícara de aveia','1 colher (sopa) de uva-passa','Canela a gosto'],steps:['Aqueça o forno a 180 °C e forre uma assadeira pequena.','Misture banana, aveia, uva-passa e canela até formar massa úmida.','Faça 4 montinhos, achate levemente e asse por 15 a 18 minutos.']},
 'Sorvete rápido de frutas':{ingredients:['1 banana congelada em rodelas','½ xícara de manga congelada','2 colheres (sopa) de iogurte natural','1 colher (chá) de limão'],steps:['Deixe as frutas congeladas fora do freezer por 3 minutos.','Processe banana, manga, iogurte e limão até ficar cremoso.','Sirva imediatamente para textura de sorvete ou congele por 20 minutos para ficar mais firme.']},
 'Macarrão alho e tomate':{ingredients:['70 g de macarrão seco','2 tomates médios picados','1 dente de alho fatiado','2 colheres (sopa) de cebola picada','1 colher (chá) de azeite','Cheiro-verde e sal a gosto'],steps:['Cozinhe o macarrão até ficar al dente e reserve um pouco da água do cozimento.','Refogue alho e cebola no azeite; junte os tomates e cozinhe por 5 minutos.','Misture a massa ao molho, usando água reservada se necessário, e finalize com cheiro-verde.']},
 'Arroz de forno econômico':{ingredients:['¾ de xícara de arroz cozido','1 ovo','2 colheres (sopa) de milho','¼ de cenoura ralada','2 colheres (sopa) de queijo ralado','1 colher (sopa) de leite'],steps:['Aqueça o forno a 200 °C e unte um refratário pequeno.','Misture arroz, ovo batido, milho, cenoura, leite, sal e metade do queijo.','Coloque no refratário, cubra com o queijo restante e asse por 15 minutos.']},
 'Feijão tropeiro leve':{ingredients:['½ xícara de feijão cozido e escorrido','1 ovo','½ xícara de couve fatiada','2 colheres (sopa) de farinha de mandioca','2 colheres (sopa) de cebola picada','1 colher (chá) de azeite'],steps:['Refogue a cebola no azeite, junte o ovo e mexa até cozinhar.','Adicione couve e feijão, misturando por 2 minutos.','Acrescente a farinha aos poucos apenas para dar liga e sirva.']},
 'Batata recheada de atum':{ingredients:['1 batata média','1 lata pequena de atum em água escorrido','1 colher (sopa) de milho','2 colheres (sopa) de iogurte natural','Cheiro-verde e limão a gosto'],steps:['Fure a batata e cozinhe no micro-ondas por 6 a 8 minutos ou no forno até ficar macia.','Misture atum, milho, iogurte, limão e cheiro-verde.','Abra a batata ao meio, amasse levemente a polpa e recheie com a mistura.']},
 'Lentilha com arroz':{ingredients:['½ xícara de lentilha seca','½ xícara de arroz cozido','½ cenoura em cubos','1 dente de alho','2 colheres (sopa) de cebola','1 colher (chá) de azeite'],steps:['Cozinhe a lentilha em água até ficar macia, cerca de 20 minutos.','Refogue alho, cebola e cenoura no azeite; junte a lentilha escorrida e tempere.','Sirva com arroz cozido e cheiro-verde.']},
 'Sanduíche de ovo cremoso':{ingredients:['2 fatias de pão integral','2 ovos cozidos','1 colher (sopa) de iogurte natural','¼ de cenoura ralada','2 folhas de alface','Sal e pimenta a gosto'],steps:['Amasse os ovos cozidos com iogurte, sal e pimenta.','Misture a cenoura ralada ao creme de ovo.','Distribua sobre uma fatia de pão, acrescente alface, feche com a outra fatia e sirva.']},
 'Cuscuz com ovo':{ingredients:['½ xícara de flocão de milho','¼ de xícara de água','1 ovo','½ tomate pequeno picado','1 colher (chá) de azeite','Sal a gosto'],steps:['Hidrate o flocão com água e sal por 5 minutos; cozinhe na cuscuzeira por 8 minutos.','Aqueça o azeite, refogue o tomate rapidamente e acrescente o ovo batido.','Sirva o ovo mexido sobre o cuscuz quente.']},
 'Bolo de caneca de banana':{ingredients:['1 banana pequena madura','1 ovo','3 colheres (sopa) de aveia','½ colher (chá) de fermento','Canela a gosto'],steps:['Amasse a banana em uma caneca grande e misture o ovo e a aveia.','Acrescente canela e fermento por último, mexendo apenas até incorporar.','Leve ao micro-ondas por 1 minuto e 30 segundos a 2 minutos, observando para não ressecar.']}
};
const extraRecipes=[
['🍳','Omelete de aveia e queijo','Café da manhã','12 min','310 kcal',['2 ovos','2 colheres (sopa) de aveia fina','30 g de queijo minas em cubos','½ tomate em cubos','1 colher (chá) de azeite','Sal e orégano a gosto'],['Bata os ovos com a aveia, sal e orégano.','Aqueça o azeite em frigideira pequena, junte o tomate e despeje a mistura.','Espalhe o queijo, tampe e cozinhe em fogo baixo por 4 a 5 minutos; dobre e sirva.']],
['🥣','Mingau de cacau e banana','Café da manhã','8 min','330 kcal',['200 ml de leite','3 colheres (sopa) de aveia','1 banana pequena em rodelas','1 colher (chá) de cacau em pó','1 colher (chá) de pasta de amendoim, opcional'],['Misture leite, aveia e cacau em uma panela pequena.','Cozinhe mexendo em fogo baixo por 4 a 5 minutos, até engrossar.','Sirva com banana e a pasta de amendoim por cima.']],
['🧇','Waffle de banana e canela','Café da manhã','15 min','290 kcal',['1 banana madura','1 ovo','3 colheres (sopa) de aveia','½ colher (chá) de fermento','Canela a gosto','1 colher (chá) de óleo para untar'],['Amasse a banana e misture com ovo, aveia, fermento e canela.','Unte uma sanduicheira ou frigideira antiaderente.','Cozinhe até dourar dos dois lados e sirva quente.']],
['🥙','Tapioca de queijo e tomate','Café da manhã','10 min','300 kcal',['3 colheres (sopa) de goma de tapioca','40 g de queijo minas ralado','½ tomate pequeno picado','Orégano a gosto'],['Aqueça uma frigideira antiaderente e espalhe a goma de tapioca.','Quando a massa firmar, distribua queijo, tomate e orégano em uma metade.','Dobre a tapioca e mantenha no fogo baixo por 1 minuto para derreter o queijo.']],
['🍛','Frango com abóbora e arroz','Hipertrofia','30 min','510 kcal',['120 g de peito de frango em cubos','½ xícara de arroz cozido','1 xícara de abóbora em cubos','½ xícara de brócolis','1 colher (chá) de azeite','Alho, páprica, sal e limão a gosto'],['Tempere o frango com limão, alho, páprica e sal; grelhe no azeite até cozinhar.','Asse a abóbora a 200 °C por cerca de 20 minutos e cozinhe o brócolis no vapor.','Monte o prato com arroz, frango, abóbora e brócolis.']],
['🍝','Macarrão com carne e legumes','Hipertrofia','25 min','560 kcal',['80 g de macarrão seco','100 g de patinho moído','½ abobrinha em cubos','½ cenoura ralada','½ xícara de molho de tomate','1 colher (chá) de azeite'],['Cozinhe o macarrão em água e sal até ficar al dente.','Refogue a carne no azeite, junte abobrinha, cenoura e molho; cozinhe por 5 minutos.','Misture a massa ao molho e sirva.']],
['🌯','Burrito de frango e arroz','Hipertrofia','20 min','530 kcal',['1 tortilha integral grande','100 g de frango desfiado','⅓ de xícara de arroz cozido','¼ de xícara de feijão cozido','1 colher (sopa) de cottage','Tomate, alface e páprica a gosto'],['Misture o frango com páprica e cottage.','Aqueça a tortilha por 20 segundos de cada lado.','Distribua arroz, feijão, frango, tomate e alface; dobre as laterais e enrole.']],
['🥘','Frango ao molho cremoso com batata','Hipertrofia','30 min','540 kcal',['120 g de frango em tiras','1 batata média cozida em cubos','2 colheres (sopa) de iogurte natural','½ xícara de ervilhas','1 colher (chá) de azeite','Mostarda, sal e pimenta a gosto'],['Cozinhe a batata até ficar macia e reserve.','Doure o frango no azeite com sal e pimenta; adicione ervilhas.','Desligue o fogo, misture iogurte e mostarda e sirva com a batata.']],
['🥗','Salada morna de frango e batata','Emagrecimento','25 min','360 kcal',['100 g de frango grelhado','1 batata pequena cozida','2 xícaras de folhas','½ cenoura ralada','½ tomate em cubos','1 colher (chá) de azeite e limão'],['Cozinhe a batata em cubos até ficar macia e grelhe o frango.','Disponha folhas, cenoura e tomate em um prato.','Acrescente frango e batata ainda mornos; tempere com azeite, limão e sal.']],
['🍲','Sopa cremosa de abóbora com carne','Emagrecimento','35 min','330 kcal',['1½ xícara de abóbora em cubos','80 g de patinho moído','½ cenoura em rodelas','½ cebola pequena','500 ml de água','1 colher (chá) de azeite'],['Refogue cebola e carne no azeite até a carne cozinhar.','Acrescente abóbora, cenoura e água; cozinhe até os legumes ficarem macios.','Bata parte dos legumes, volte à panela e ajuste sal e ervas.']],
['🐟','Peixe com arroz e salada crocante','Emagrecimento','25 min','350 kcal',['120 g de filé de peixe','⅓ de xícara de arroz cozido','1 xícara de repolho fatiado','½ cenoura ralada','Suco de ½ limão','1 colher (chá) de azeite'],['Tempere o peixe com limão, sal e ervas e grelhe por 3 a 4 minutos de cada lado.','Misture repolho e cenoura com azeite, limão e uma pitada de sal.','Sirva o peixe com arroz e a salada.']],
['🍳','Ovos assados com legumes','Emagrecimento','20 min','290 kcal',['2 ovos','½ abobrinha ralada','½ tomate picado','1 colher (sopa) de cebola','30 g de queijo branco','1 colher (chá) de azeite'],['Refogue abobrinha, tomate e cebola no azeite por 2 minutos.','Coloque em um refratário pequeno, quebre os ovos por cima e espalhe o queijo.','Asse a 200 °C por 10 a 12 minutos, até as claras firmarem.']],
['🍕','Mini pizza de tapioca','Lanche','12 min','260 kcal',['2 colheres (sopa) de goma de tapioca','2 colheres (sopa) de molho de tomate','40 g de muçarela','½ tomate em rodelas','Orégano a gosto'],['Faça um disco de tapioca em frigideira antiaderente.','Vire, espalhe molho, queijo, tomate e orégano.','Tampe por 2 minutos em fogo baixo, até o queijo derreter.']],
['🍌','Banana assada com canela e iogurte','Lanche','10 min','230 kcal',['1 banana média','1 colher (chá) de canela','120 g de iogurte natural','1 colher (sopa) de aveia'],['Corte a banana ao meio e polvilhe canela.','Asse em air fryer a 180 °C por 6 minutos ou aqueça em frigideira.','Sirva com iogurte e aveia.']],
['🥪','Tostex de ricota e tomate','Lanche','10 min','280 kcal',['2 fatias de pão integral','4 colheres (sopa) de ricota amassada','½ tomate em rodelas','Orégano e sal a gosto'],['Tempere a ricota com sal e orégano.','Monte o sanduíche com ricota e tomate.','Aqueça em sanduicheira ou frigideira tampada até dourar.']],
['🍓','Taça de iogurte com morango','Lanche','5 min','250 kcal',['170 g de iogurte natural','6 morangos fatiados','2 colheres (sopa) de granola sem açúcar','1 colher (chá) de mel, opcional'],['Coloque metade do iogurte em um copo ou pote.','Faça uma camada de morangos e granola.','Finalize com o restante do iogurte e mel, se desejar.']],
['🍚','Arroz, ovo e legumes na frigideira','Baixo custo','15 min','390 kcal',['¾ de xícara de arroz cozido','2 ovos','½ cenoura ralada','¼ de xícara de milho','1 colher (chá) de óleo','Cebolinha e sal a gosto'],['Aqueça o óleo e mexa os ovos até quase firmarem.','Junte cenoura e milho e refogue por 2 minutos.','Acrescente arroz, cebolinha e sal; misture até aquecer por completo.']],
['🥔','Batata recheada com ovo e queijo','Baixo custo','25 min','370 kcal',['1 batata média','2 ovos','30 g de queijo branco','1 colher (sopa) de tomate picado','Orégano e sal a gosto'],['Cozinhe ou asse a batata até ficar macia; abra ao meio.','Misture ovos cozidos picados, queijo, tomate e orégano.','Recheie a batata e leve à air fryer ou forno por 5 minutos.']],
['🐟','Macarrão rápido de sardinha','Baixo custo','20 min','440 kcal',['70 g de macarrão seco','1 lata pequena de sardinha escorrida','½ xícara de molho de tomate','½ cebola pequena','1 colher (chá) de azeite','Cheiro-verde a gosto'],['Cozinhe o macarrão até ficar al dente.','Refogue cebola no azeite, adicione molho e sardinha e aqueça por 3 minutos.','Misture a massa ao molho e finalize com cheiro-verde.']],
['🌽','Cuscuz com ovos mexidos e tomate','Baixo custo','18 min','350 kcal',['½ xícara de flocão de milho','¼ de xícara de água','2 ovos','½ tomate picado','1 colher (chá) de azeite','Sal e orégano a gosto'],['Hidrate o flocão com água e sal por 5 minutos e cozinhe na cuscuzeira.','Refogue tomate no azeite e acrescente os ovos batidos.','Sirva os ovos mexidos sobre o cuscuz com orégano.']],
['🍝','Macarrão cremoso de cogumelos','Vegetariana','25 min','440 kcal',['70 g de macarrão seco','1 xícara de cogumelos fatiados','2 colheres (sopa) de creme de ricota','½ xícara de leite','½ cebola pequena','1 colher (chá) de azeite'],['Cozinhe o macarrão até ficar al dente.','Refogue cebola e cogumelos no azeite até dourar.','Junte leite e creme de ricota, aqueça sem ferver e misture à massa.']],
['🫑','Pimentão recheado de arroz e queijo','Vegetariana','35 min','400 kcal',['1 pimentão grande cortado ao meio','¾ de xícara de arroz cozido','½ xícara de tomate picado','50 g de queijo muçarela','1 colher (sopa) de cebola','Ervas e sal a gosto'],['Misture arroz, tomate, cebola, metade do queijo e ervas.','Recheie as metades de pimentão e cubra com o queijo restante.','Asse a 200 °C por 20 a 25 minutos, até ficar macio.']],
['🥞','Panqueca de queijo e espinafre','Vegetariana','20 min','360 kcal',['1 ovo','3 colheres (sopa) de aveia','½ xícara de leite','½ xícara de espinafre picado','40 g de ricota','1 colher (chá) de azeite'],['Bata ovo, aveia e leite até formar uma massa líquida.','Faça duas panquecas em frigideira untada.','Refogue rapidamente o espinafre, misture com ricota e recheie as panquecas.']],
['🍚','Arroz cremoso de abóbora e queijo','Vegetariana','25 min','430 kcal',['¾ de xícara de arroz cozido','1 xícara de abóbora cozida e amassada','40 g de queijo minas','¼ de xícara de leite','½ cebola pequena','1 colher (chá) de azeite'],['Refogue a cebola no azeite.','Junte abóbora, leite e arroz e cozinhe mexendo até ficar cremoso.','Acrescente queijo em cubos, ajuste o sal e sirva.']]
];
extraRecipes.forEach(([icon,name,category,time,kcal,ingredients,steps])=>{recipes.push([icon,name,category,time,ingredients.join(', '),steps.at(-1),kcal]);recipeDetails[name]={ingredients,steps}});
const recipeVideos={
 'Panqueca de banana e aveia':{url:'https://www.youtube.com/watch?v=RMqTIFTVLrk',type:'Vídeo direto'},
 'Overnight oats de morango':{url:'https://www.youtube.com/watch?v=_ZwxM_K-fvQ',type:'Vídeo direto'},
 'Crepioca de ricota':{url:'https://www.youtube.com/shorts/mBPFa4QEwDw',type:'Short'},
 'Cuscuz com ovo':{url:'https://www.youtube.com/shorts/FuKSHpBUyxY',type:'Short'},
 'Cookie de banana e aveia':{url:'https://www.youtube.com/watch?v=2_vTpSg7q4Y',type:'Vídeo direto'},
 'Muffin de aveia':{url:'https://www.youtube.com/watch?v=XxwKqmrpwAU',type:'Vídeo direto'},
 'Bolo de caneca de banana':{url:'https://www.youtube.com/watch?v=UM0MSJOOTQ8',type:'Vídeo direto'}
};
function save(){localStorage.setItem(DBKEY,JSON.stringify(db));renderAll()}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2600)}
function date(){return new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long',weekday:'long'})}
function iso(){return new Date().toISOString().slice(0,10)}
function selected(arr,v){return arr.includes(v)?'checked':''}
function escapeHTML(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function equipmentChoiceMarkup(saved=[],includeAll=false,compact=false){const choices=items=>items.map(x=>`<label><input type="checkbox" value="${x}" ${selected(saved,x)}> ${x}</label>`).join('');const compactClass=compact?' compact':'';return `${includeAll?`<label class="select-all"><input id="selectAllEquipment" type="checkbox" ${saved.length===equipment.length?'checked':''}> Selecionar tudo</label>`:''}<section class="equipment-group"><h3>Equipamentos de treino</h3><div class="check-grid${compactClass}">${choices(trainingEquipment)}</div></section><section class="equipment-group"><h3>Itens comuns de casa</h3><p class="hint">Use apenas itens firmes e em boas condições; o cabo de vassoura é somente para mobilidade.</p><div class="check-grid${compactClass}">${choices(homeEquipment)}</div></section>`}
function setTheme(theme){db.theme=theme;document.body.classList.toggle('dark',theme==='dark');$('#profileTheme').checked=theme==='dark';saveLocalOnly()}
function saveLocalOnly(){localStorage.setItem(DBKEY,JSON.stringify(db))}
function go(view,fromBack=false){const current=viewHistory.at(-1);if(!fromBack&&view!==current)viewHistory.push(view);$$('.view').forEach(v=>v.classList.toggle('active',v.id===view));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('#appBack').classList.toggle('hidden',viewHistory.length<2);window.scrollTo({top:0,behavior:'smooth'});if(view==='workout')renderWorkout()}
function renderAll(){renderDashboard();renderAssessment();renderExercises();renderProgress();renderNutrition();renderProfile();renderSheets();renderWorkout();renderDiastasisGuide();}
function renderDashboard(){const p=db.profile,name=String(p.name||'').trim(),hasName=Boolean(name);$('#welcomePrefix').textContent=hasName?'Olá':'Boas-vindas';$('#welcomeName').textContent=hasName?`, ${name}`:'';const w=db.weights.at(-1)?.value||p.weight;$('#weightStat').textContent=w?`${w} kg`:'—';$('#weightTrend').textContent=db.weights.length>1?'Histórico atualizado':'Registre seu primeiro peso';$('#workoutStat').textContent=db.workouts.length;const a=db.assessments.at(-1);if(a){let d=new Date(a.date);d.setDate(d.getDate()+28);$('#assessmentStat').textContent=d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}else $('#assessmentStat').textContent='—'}
function testCardMarkup(test){if(test.type==='shoulder')return `<article class="test-entry shoulder-test"><div class="test-info"><strong>${test.name}</strong><p class="test-definition">Como testar: ${test.instruction}</p></div><label class="test-answer">Resultado<select name="test-${test.key}"><option value="">Selecione como foi</option><option>Elevo os dois braços acima da cabeça sem dor</option><option>Elevo, com leve rigidez ou desconforto</option><option>Movimento limitado ou com dor</option></select></label><label class="test-note">Lado e movimento (opcional)<input name="test-note-${test.key}" placeholder="Ex.: direito; dói ao elevar acima da cabeça" /></label></article>`;return `<article class="test-entry"><div class="test-info"><strong>${test.name}</strong><p class="test-definition"><b>O que conta:</b> ${test.definition}</p><small>${test.protocol}</small></div><div class="test-form-fields"><label class="test-variant">${test.variantLabel}<select name="test-variation-${test.key}"><option value="">Selecione a variação</option>${test.variants.map(variation=>`<option>${variation}</option>`).join('')}</select></label><label class="test-value">${test.measureLabel}<div><input type="number" inputmode="numeric" min="0" step="1" name="test-${test.key}" placeholder="Ex.: 12" /><span>${test.unit}</span></div></label></div></article>`}
function renderAssessment(){const p=db.profile;const f=$('#assessmentForm');['name','age','height','weight','days','duration','diastasisStatus'].forEach(k=>{if(f.elements[k])f.elements[k].value=p[k]||''});['name','age','height'].forEach(k=>{if(f.elements[k]){f.elements[k].readOnly=true;f.elements[k].title='Edite este dado na página Perfil'}});let profileNote=$('#assessmentProfileNote');if(!profileNote){f.querySelector('.panel').insertAdjacentHTML('beforeend',`<p class="hint" id="assessmentProfileNote">Nome, idade e altura vêm do seu perfil para evitar preenchimento duplicado. <button type="button" class="text-button">Editar no perfil</button></p>`);profileNote=$('#assessmentProfileNote');profileNote.querySelector('button').onclick=()=>go('profile')}f.elements.notes.value=p.notes||'';f.elements.diastasisFocus.checked=!!p.diastasisFocus;$('#equipmentChoices').innerHTML=equipmentChoiceMarkup(p.equipment||[],true);$('#selectAllEquipment').onchange=e=>$$('#equipmentChoices input:not(#selectAllEquipment)').forEach(x=>x.checked=e.target.checked);$('#limitationChoices').innerHTML=limitations.map(x=>`<label><input type="checkbox" value="${x}" ${selected(p.limitations||[],x)}> ${x}</label>`).join('');$('#assessmentTests').innerHTML=`<h3>Testes padronizados <small>(opcionais agora)</small></h3><p class="hint test-intro">Cada resultado é uma única tentativa contínua — não some séries. Na próxima avaliação, escolha a mesma variação para comparar.</p>${tests.map(testCardMarkup).join('')}`;$$('#assessment [data-choice] button').forEach(b=>b.classList.toggle('selected',b.dataset.value===p.goal))}
function renderDiastasisGuide(){const guide=db.profile.diastasisGuide||{signs:[],notes:'',updated:''};$('#diastasisGuideChoices').innerHTML=diastasisSigns.map(sign=>`<label><input type="checkbox" value="${sign}" ${selected(guide.signs||[],sign)}> ${sign}</label>`).join('');$('#diastasisGuideNotes').value=guide.notes||'';$('#diastasisGuideSaved').textContent=guide.updated?`Observação salva em ${new Date(guide.updated+'T12:00').toLocaleDateString('pt-BR')}.`:'';renderDiastasisRoutine()}
function diastasisGuideSummary(){const guide=db.profile.diastasisGuide||{signs:[],notes:''};return `Resumo para consulta — MarinaFit Pro\n\nSituação registrada: ${db.profile.diastasisStatus||'Não informada'}\nFoco em prevenção/cuidado: ${db.profile.diastasisFocus?'Sim':'Não'}\nSinais observados: ${(guide.signs||[]).length?guide.signs.join('; '):'Nenhum sinal selecionado'}\nContexto e observações: ${guide.notes||'Não informado'}\n\nEste resumo é uma auto-observação e não confirma diagnóstico.`}
async function copyDiastasisGuide(){const summary=diastasisGuideSummary();try{await navigator.clipboard.writeText(summary)}catch{const field=document.createElement('textarea');field.value=summary;document.body.append(field);field.select();document.execCommand('copy');field.remove()}toast('Resumo copiado para você levar à consulta')}
function initDiastasisGuideEvents(){$('#saveDiastasisGuide').onclick=()=>{db.profile.diastasisGuide={signs:[...$$('#diastasisGuideChoices input:checked')].map(x=>x.value),notes:$('#diastasisGuideNotes').value.trim(),updated:iso()};save();toast('Observação salva no seu perfil')};$('#copyDiastasisGuide').onclick=copyDiastasisGuide}
function libraryTrainingSet(){return db.training?.librarySet||[]}
function mfIllustrationText(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function exerciseIllustrationSpec(exercise){
 const name=mfIllustrationText(exercise?.name),equip=mfIllustrationText(exercise?.equip),family=exercise?.family||'';
 const spec=(atlas,pose)=>({atlas,pose});
 /* A escolha começa pelo movimento realmente selecionado, e não apenas pelo grupo muscular. */
 if(/flexao na parede/.test(name))return spec('atlas-push',1);
 if(/flexao inclinada/.test(name))return spec('atlas-push',2);
 if(/flexao declinada/.test(name))return spec('atlas-push',4);
 if(/mergulho em banco/.test(name))return spec('atlas-push',5);
 if(/supino.*halter|crucifixo com halter/.test(name))return spec('atlas-push',6);
 if(/supino na maquina|chest press|peck deck/.test(name))return spec('atlas-push',7);
 if(/crucifixo no cabo|crossover/.test(name))return spec('atlas-push',8);
 if(/elastico/.test(name)&&(/supino|peito|flexao/.test(name)||family==='push'))return spec('atlas-push',9);
 if(/flexao|triceps|supino|crucifixo/.test(name)||family==='push'||family==='triceps')return spec('atlas-push',3);
 if(/depressao escapular|sustentacao ativa/.test(name))return spec('atlas-pull',1);
 if(/assistida/.test(name)&&/barra/.test(name))return spec('atlas-pull',2);
 if(/barra fixa|negativa de barra/.test(name))return spec('atlas-pull',3);
 if(/remada australiana/.test(name))return spec('atlas-pull',4);
 if(/puxada frontal|pulldown|puxada com elastico/.test(name))return spec('atlas-pull',5);
 if(/remada baixa|remada unilateral no cabo/.test(name))return spec('atlas-pull',6);
 if(/remada.*halter/.test(name))return spec('atlas-pull',7);
 if(/remada articulada/.test(name))return spec('atlas-pull',8);
 if(/remada.*elastico|puxada sentada com elastico/.test(name))return spec('atlas-pull',9);
 if(/remada|puxada|rosca|face pull/.test(name)||family==='pull'||family==='row'||family==='biceps')return spec('atlas-pull',equip.includes('elastico')?9:8);
 if(/isometria na parede|wall sit/.test(name))return spec('atlas-legs',2);
 if(/afundo/.test(name))return spec('atlas-legs',3);
 if(/bulgaro/.test(name))return spec('atlas-legs',4);
 if(/leg press/.test(name))return spec('atlas-legs',5);
 if(/extensao de joelho|cadeira extensora/.test(name))return spec('atlas-legs',6);
 if(/flexora/.test(name))return spec('atlas-legs',7);
 if(/panturrilha/.test(name))return spec('atlas-legs',8);
 if(/subida no banco|step.?up|degrau/.test(name))return spec('atlas-legs',9);
 if(/agachamento|pistola|shrimp|cossaco/.test(name)||family==='squat'||family==='lunge'||family==='step'||family==='calf'||family==='knee-extension'||family==='hamstrings')return spec('atlas-legs',1);
 if(/sofa/.test(name)&&/elevacao|ponte/.test(name))return spec('atlas-core',2);
 if(/elevacao pelvica com barra/.test(name))return spec('atlas-core',1);
 if(/ponte|elevacao de quadril|coice de gluteo/.test(name)||family==='bridge'||family==='hip')return spec('atlas-core',1);
 if(/prancha lateral/.test(name))return spec('atlas-core',4);
 if(/prancha frontal|prancha bear|prancha reversa/.test(name))return spec('atlas-core',3);
 if(/dead bug|toe taps|the hundred|single leg stretch/.test(name))return spec('atlas-core',5);
 if(/bird dog|quatro apoios|natação|swimming/.test(name))return spec('atlas-core',6);
 if(/clam shell|abducao|caminhada lateral|mini band/.test(name))return spec('atlas-core',7);
 if(/mobilidade de ombro|wall slide|retracao cervical|rotacao cervical/.test(name)||family==='shoulder'||family==='shoulder-mobility'||family==='neck')return spec('atlas-core',8);
 if(exercise?.cat==='Diástase'||family==='diastasis'||/respiracao 360|ativacao profunda|deslize de calcanhar|abertura de joelho/.test(name))return spec('atlas-core',9);
 if(/pallof|hollow|abdominal|roll down|gato-vaca|mermaid|circulos com a perna|alongamento|mobilidade/.test(name)||family==='core'||family==='spine-mobility')return spec('atlas-core',5);
 return spec('atlas-core',exercise?.cat==='Pilates em casa'?6:3);
}
function exerciseMotionSpec(exercise,visual){
 const name=mfIllustrationText(exercise?.name);
 if(visual.atlas==='atlas-push'){
  if(/supino na maquina|chest press|peck deck/.test(name))return {atlas:'motion-push',row:2};
  if(/elastico/.test(name)&&(/supino|peito|flexao/.test(name)||exercise?.family==='push'))return {atlas:'motion-push',row:3};
  if(/flexao|mergulho/.test(name))return {atlas:'motion-push',row:1};
 }
 if(visual.atlas==='atlas-pull'){
  if(/barra fixa|negativa de barra|sustentacao ativa|depressao escapular/.test(name))return {atlas:'motion-pull',row:1};
  if(/remada baixa|remada unilateral no cabo/.test(name))return {atlas:'motion-pull',row:2};
  if(/remada.*elastico|puxada sentada com elastico/.test(name))return {atlas:'motion-pull',row:3};
 }
 if(visual.atlas==='atlas-legs'){
  if(/leg press/.test(name))return {atlas:'motion-legs',row:2};
  if(/extensao de joelho|cadeira extensora/.test(name))return {atlas:'motion-legs',row:3};
  if(/agachamento/.test(name))return {atlas:'motion-legs',row:1};
 }
 if(visual.atlas==='atlas-core'){
  if(/ponte|elevacao de quadril|elevacao pelvica/.test(name))return {atlas:'motion-core',row:1};
  if(/prancha frontal/.test(name))return {atlas:'motion-core',row:2};
  if(/dead bug|toe taps/.test(name))return {atlas:'motion-core',row:3};
 }
 return null;
}
function exerciseIllustrationMarkup(exercise,compact=false){const visual=exerciseIllustrationSpec(exercise),motion=exerciseMotionSpec(exercise,visual),label=escapeHTML(exercise?.name||'movimento'),classes=[compact?'exercise-glyph':'','exercise-illustration',visual.atlas,`pose-${visual.pose}`,motion?.atlas,motion&&`motion-row-${motion.row}`].filter(Boolean).join(' '),type=motion?'Animação demonstrativa em loop':'Ilustração demonstrativa';return `<span class="${classes}" role="img" aria-label="${type}: ${label}"></span>`}
/* Matriz conservadora: não reaproveita uma foto por semelhança de grupo muscular. */
function mfVerifiedExerciseVisual(exercise){
 const name=mfIllustrationText(exercise?.name),equip=mfIllustrationText(exercise?.equip),spec=(atlas,pose)=>({atlas,pose});
 if(/flexao pike/.test(name)||/desenvolvimento (sentado )?com halteres/.test(name)||/^elevacao lateral$/.test(name)&&(!equip||equip.includes('halter')))return spec('atlas-shoulders',1);
 if(/flexao na parede/.test(name))return spec('atlas-push',1);
 if(/flexao inclinada/.test(name))return spec('atlas-push',2);
 if(/^flexao de braco$/.test(name))return spec('atlas-push',3);
 if(/flexao declinada/.test(name))return spec('atlas-push',4);
 if(/mergulho em banco/.test(name))return spec('atlas-push',5);
 if(/supino.*halter|crucifixo com halter/.test(name))return spec('atlas-push',6);
 if(/supino na maquina|chest press|peck deck/.test(name))return spec('atlas-push',7);
 if(/crucifixo no cabo|crossover/.test(name))return spec('atlas-push',8);
 if(/elastico/.test(name)&&(/supino|peito|flexao/.test(name)))return spec('atlas-push',9);
 if(/depressao escapular|sustentacao ativa/.test(name))return spec('atlas-pull',1);
 if(/assistida/.test(name)&&/barra/.test(name))return spec('atlas-pull',2);
 if(/barra fixa|negativa de barra/.test(name))return spec('atlas-pull',3);
 if(/remada australiana/.test(name))return spec('atlas-pull',4);
 if(/puxada frontal|pulldown/.test(name))return spec('atlas-pull',5);
 if(/remada baixa|remada unilateral no cabo/.test(name))return spec('atlas-pull',6);
 if(/remada.*halter/.test(name))return spec('atlas-pull',7);
 if(/remada articulada/.test(name))return spec('atlas-pull',8);
 if(/remada.*elastico|puxada sentada com elastico/.test(name))return spec('atlas-pull',9);
 if(/isometria na parede|wall sit/.test(name))return spec('atlas-legs',2);
 if(/^afundo alternado$/.test(name))return spec('atlas-legs',3);
 if(/agachamento bulgaro/.test(name))return spec('atlas-legs',4);
 if(/leg press/.test(name))return spec('atlas-legs',5);
 if(/extensao de joelho|cadeira extensora/.test(name))return spec('atlas-legs',6);
 if(/^mesa flexora$/.test(name))return spec('atlas-legs',7);
 if(/^panturrilha em pe$/.test(name))return spec('atlas-legs',8);
 if(/^subida no banco$/.test(name))return spec('atlas-legs',9);
 if(/^agachamento controlado$|^agachamento livre$/.test(name))return spec('atlas-legs',1);
 if(/sofa/.test(name)&&/elevacao|ponte/.test(name))return spec('atlas-core',2);
 if(/^elevacao de quadril$|^ponte de gluteos$/.test(name))return spec('atlas-core',1);
 if(/^prancha lateral$/.test(name))return spec('atlas-core',4);
 if(/^prancha frontal$/.test(name))return spec('atlas-core',3);
 if(/^dead bug$|^toe taps$/.test(name))return spec('atlas-core',5);
 if(/^bird dog$/.test(name))return spec('atlas-core',6);
 if(/clam shell/.test(name))return spec('atlas-core',7);
 if(/mobilidade de ombro|wall slide/.test(name))return spec('atlas-core',8);
 return null;
}
function mfVerifiedExerciseMotion(exercise,visual){
 const name=mfIllustrationText(exercise?.name),equip=mfIllustrationText(exercise?.equip);
 if(/flexao pike/.test(name))return {atlas:'motion-shoulders',row:1};
 if(/desenvolvimento (sentado )?com halteres/.test(name))return {atlas:'motion-shoulders',row:2};
 if(/^elevacao lateral$/.test(name)&&(!equip||equip.includes('halter')))return {atlas:'motion-shoulders',row:3};
 if(!visual)return null;
 if(visual.atlas==='atlas-push'){
  if(/supino na maquina|chest press|peck deck/.test(name))return {atlas:'motion-push',row:2};
  if(/elastico/.test(name)&&(/supino|peito|flexao/.test(name)))return {atlas:'motion-push',row:3};
  if(/^flexao de braco$/.test(name))return {atlas:'motion-push',row:1};
 }
 if(visual.atlas==='atlas-pull'){
  if(/barra fixa|negativa de barra|sustentacao ativa|depressao escapular/.test(name))return {atlas:'motion-pull',row:1};
  if(/remada baixa|remada unilateral no cabo/.test(name))return {atlas:'motion-pull',row:2};
  if(/remada.*elastico|puxada sentada com elastico/.test(name))return {atlas:'motion-pull',row:3};
 }
 if(visual.atlas==='atlas-legs'){
  if(/leg press/.test(name))return {atlas:'motion-legs',row:2};
  if(/extensao de joelho|cadeira extensora/.test(name))return {atlas:'motion-legs',row:3};
  if(/^agachamento controlado$|^agachamento livre$/.test(name))return {atlas:'motion-legs',row:1};
 }
 if(visual.atlas==='atlas-core'){
  if(/^elevacao de quadril$|^ponte de gluteos$/.test(name))return {atlas:'motion-core',row:1};
  if(/^prancha frontal$/.test(name))return {atlas:'motion-core',row:2};
  if(/^dead bug$|^toe taps$/.test(name))return {atlas:'motion-core',row:3};
 }
 return null;
}
function exerciseIllustrationMarkup(exercise,compact=false){const visual=mfVerifiedExerciseVisual(exercise),motion=mfVerifiedExerciseMotion(exercise,visual),label=escapeHTML(exercise?.name||'movimento');if(!visual)return `<span class="${compact?'exercise-glyph ':''}exercise-illustration exercise-illustration-unavailable" role="img" aria-label="Demonstração específica disponível no vídeo: ${label}"><span aria-hidden="true">▶</span><small>Vídeo</small></span>`;const classes=[compact?'exercise-glyph':'','exercise-illustration',visual.atlas,`pose-${visual.pose}`,motion?.atlas,motion&&`motion-row-${motion.row}`].filter(Boolean).join(' '),type=motion?'Animação demonstrativa em loop':'Ilustração demonstrativa';return `<span class="${classes}" role="img" aria-label="${type}: ${label}"></span>`}
function exerciseCardMarkup(e){const selected=libraryTrainingSet().includes(e.name),care=Array.isArray(e.care)&&e.care.length?`<p class="exercise-purpose"><b>Finalidade de cuidado:</b> ${escapeHTML(e.care.join(', '))}</p>`:'',safety=e.safety?`<p class="exercise-safety"><b>Atenção:</b> ${escapeHTML(e.safety)}</p>`:'';return `<article class="exercise-card"><div class="exercise-visual">${exerciseIllustrationMarkup(e)}</div><div><span class="tag">${e.cat} · ${e.equip}</span><h3>${e.name}</h3><p>${e.area}<br>${e.detail}</p>${care}${safety}<div class="exercise-card-actions"><a target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.youtube)}">▶ Ver demonstração</a><button class="text-button" type="button" data-library-exercise="${escapeHTML(e.name)}">${selected?'✓ No meu treino':'＋ Incluir no treino'}</button></div></div></article>`}
/* Catálogo visual auditado. Cada chave é exercício + equipamento; não há fallback por categoria ou músculo. */
const mfAuditedVisualCatalog={
 'supino reto com barra':{atlas:'atlas-academy-push-arms',pose:1,equipment:['Barra e anilhas']},
 'supino inclinado com barra':{atlas:'atlas-academy-push-arms',pose:2,equipment:['Barra e anilhas']},
 'supino inclinado com halteres':{atlas:'atlas-academy-push-arms',pose:3,equipment:['Halteres']},
 'supino declinado com halteres':{atlas:'atlas-academy-push-arms',pose:4,equipment:['Halteres']},
 'chest press articulado':{atlas:'atlas-academy-push-arms',pose:5,equipment:['Máquinas']},
 'peck deck':{atlas:'atlas-academy-push-arms',pose:6,equipment:['Máquinas']},
 'crossover alto para baixo':{atlas:'atlas-academy-push-arms',pose:7,equipment:['Cabo/polia']},
 'crossover baixo para alto':{atlas:'atlas-academy-push-arms',pose:8,equipment:['Cabo/polia']},
 'pullover no cabo':{atlas:'atlas-academy-push-arms',pose:9,equipment:['Cabo/polia']},
 'triceps corda na polia':{atlas:'atlas-academy-push-arms',pose:10,equipment:['Cabo/polia']},
 'triceps frances com halter':{atlas:'atlas-academy-push-arms',pose:11,equipment:['Halteres']},
 'triceps testa com barra':{atlas:'atlas-academy-push-arms',pose:12,equipment:['Barra e anilhas']},
 'triceps coice':{atlas:'atlas-academy-push-arms',pose:13,equipment:['Halteres']},
 'triceps unilateral no cabo':{atlas:'atlas-academy-push-arms',pose:14,equipment:['Cabo/polia']},
 'crucifixo com halteres':{atlas:'atlas-academy-push-arms',pose:15,equipment:['Halteres']},
 'crucifixo no cabo':{atlas:'atlas-academy-push-arms',pose:16,equipment:['Cabo/polia']},
 'puxada frontal pegada aberta':{atlas:'atlas-academy-back-shoulders',pose:1,equipment:['Cabo/polia']},
 'puxada frontal supinada':{atlas:'atlas-academy-back-shoulders',pose:2,equipment:['Cabo/polia']},
 'puxada frontal pegada neutra':{atlas:'atlas-academy-back-shoulders',pose:3,equipment:['Cabo/polia']},
 'puxada unilateral no cabo':{atlas:'atlas-academy-back-shoulders',pose:4,equipment:['Cabo/polia']},
 'remada articulada':{atlas:'atlas-academy-back-shoulders',pose:5,equipment:['Máquinas']},
 'remada unilateral no cabo':{atlas:'atlas-academy-back-shoulders',pose:6,equipment:['Cabo/polia']},
 'remada cavalinho':{atlas:'atlas-academy-back-shoulders',pose:7,equipment:['Barra e anilhas']},
 'remada curvada com barra':{atlas:'atlas-academy-back-shoulders',pose:8,equipment:['Barra e anilhas']},
 'remada curvada com halteres':{atlas:'atlas-academy-back-shoulders',pose:9,equipment:['Halteres']},
 'crucifixo inverso na maquina':{atlas:'atlas-academy-back-shoulders',pose:10,equipment:['Máquinas']},
 'remada alta no cabo':{atlas:'atlas-academy-back-shoulders',pose:11,equipment:['Cabo/polia']},
 'desenvolvimento na maquina':{atlas:'atlas-academy-back-shoulders',pose:12,equipment:['Máquinas']},
 'desenvolvimento arnold':{atlas:'atlas-academy-back-shoulders',pose:13,equipment:['Halteres']},
 'elevacao frontal com halteres':{atlas:'atlas-academy-back-shoulders',pose:14,equipment:['Halteres']},
 'elevacao frontal no cabo':{atlas:'atlas-academy-back-shoulders',pose:15,equipment:['Cabo/polia']},
 'elevacao lateral no cabo':{atlas:'atlas-academy-back-shoulders',pose:16,equipment:['Cabo/polia']},
 'agachamento no smith':{atlas:'atlas-academy-legs',pose:1,equipment:['Máquinas']},
 'hack squat':{atlas:'atlas-academy-legs',pose:2,equipment:['Máquinas']},
 'leg press 45 graus':{atlas:'atlas-academy-legs',pose:3,equipment:['Máquinas']},
 'leg press horizontal':{atlas:'atlas-academy-legs',pose:4,equipment:['Máquinas']},
 'agachamento goblet':{atlas:'atlas-academy-legs',pose:5,equipment:['Halteres']},
 'cadeira extensora unilateral':{atlas:'atlas-academy-legs',pose:6,equipment:['Máquinas']},
 'cadeira flexora sentada':{atlas:'atlas-academy-legs',pose:7,equipment:['Máquinas']},
 'mesa flexora unilateral':{atlas:'atlas-academy-legs',pose:8,equipment:['Máquinas']},
 'stiff com barra':{atlas:'atlas-academy-legs',pose:9,equipment:['Barra e anilhas']},
 'stiff com halteres':{atlas:'atlas-academy-legs',pose:10,equipment:['Halteres']},
 'levantamento terra sumo':{atlas:'atlas-academy-legs',pose:11,equipment:['Barra e anilhas']},
 'cadeira adutora':{atlas:'atlas-academy-legs',pose:12,equipment:['Máquinas']},
 'coice de gluteo na maquina':{atlas:'atlas-academy-legs',pose:13,equipment:['Máquinas']},
 'coice de gluteo no cabo':{atlas:'atlas-academy-legs',pose:14,equipment:['Cabo/polia']},
 'leg press unilateral':{atlas:'atlas-academy-legs',pose:15,equipment:['Máquinas']},
 'panturrilha em pe na maquina':{atlas:'atlas-academy-legs',pose:16,equipment:['Máquinas']},
 'flexao na parede':{atlas:'atlas-push',pose:1,equipment:['Parede']},
 'flexao inclinada':{atlas:'atlas-push',pose:2,equipment:['Banco']},
 'flexao de braco':{atlas:'atlas-push',pose:3,equipment:['Peso corporal'],motion:{atlas:'motion-push',row:1}},
 'flexao declinada':{atlas:'atlas-push',pose:4,equipment:['Banco']},
 'mergulho em banco':{atlas:'atlas-push',pose:5,equipment:['Banco']},
 'supino com halteres':{atlas:'atlas-push',pose:6,equipment:['Halteres']},
 'supino na maquina':{atlas:'atlas-push',pose:7,equipment:['Máquinas'],motion:{atlas:'motion-push',row:2}},
 'crucifixo no cabo':{atlas:'atlas-push',pose:8,equipment:['Cabo/polia']},
 'supino com elastico':{atlas:'atlas-push',pose:9,equipment:['Elásticos'],motion:{atlas:'motion-push',row:3}},
 'flexao pike':{atlas:'atlas-shoulders',pose:1,equipment:['Peso corporal'],motion:{atlas:'motion-shoulders',row:1}},
 'desenvolvimento com halteres':{atlas:'atlas-shoulders',pose:1,equipment:['Halteres'],motion:{atlas:'motion-shoulders',row:2}},
 'desenvolvimento sentado com halteres':{atlas:'atlas-shoulders',pose:1,equipment:['Halteres'],motion:{atlas:'motion-shoulders',row:2}},
 'elevacao lateral':{atlas:'atlas-shoulders',pose:1,equipment:['Halteres'],motion:{atlas:'motion-shoulders',row:3}},
 'barra fixa assistida':{atlas:'atlas-pull',pose:2,equipment:['Barra fixa']},
 'barra fixa pronada':{atlas:'atlas-pull',pose:3,equipment:['Barra fixa'],motion:{atlas:'motion-pull',row:1}},
 'remada australiana':{atlas:'atlas-pull',pose:4,equipment:['Barra fixa']},
 'puxada frontal':{atlas:'atlas-pull',pose:5,equipment:['Máquinas']},
 'remada baixa':{atlas:'atlas-pull',pose:6,equipment:['Cabo/polia'],motion:{atlas:'motion-pull',row:2}},
 'remada unilateral com halter':{atlas:'atlas-pull',pose:7,equipment:['Halteres']},
 'remada articulada':{atlas:'atlas-pull',pose:8,equipment:['Máquinas']},
 'remada com elastico':{atlas:'atlas-pull',pose:9,equipment:['Elásticos'],motion:{atlas:'motion-pull',row:3}},
 'isometria na parede':{atlas:'atlas-legs',pose:2,equipment:['Parede']},
 'afundo alternado':{atlas:'atlas-legs',pose:3,equipment:['Peso corporal']},
 'agachamento bulgaro':{atlas:'atlas-legs',pose:4,equipment:['Banco']},
 'leg press':{atlas:'atlas-legs',pose:5,equipment:['Máquinas'],motion:{atlas:'motion-legs',row:2}},
 'extensao de joelho':{atlas:'atlas-legs',pose:6,equipment:['Máquinas'],motion:{atlas:'motion-legs',row:3}},
 'mesa flexora':{atlas:'atlas-legs',pose:7,equipment:['Máquinas']},
 'panturrilha em pe':{atlas:'atlas-legs',pose:8,equipment:['Peso corporal']},
 'subida no banco':{atlas:'atlas-legs',pose:9,equipment:['Banco']},
 'agachamento controlado':{atlas:'atlas-legs',pose:1,equipment:['Peso corporal'],motion:{atlas:'motion-legs',row:1}},
 'elevacao de quadril':{atlas:'atlas-core',pose:1,equipment:['Peso corporal'],motion:{atlas:'motion-core',row:1}},
 'ponte de gluteos':{atlas:'atlas-core',pose:1,equipment:['Colchonete'],motion:{atlas:'motion-core',row:1}},
 'ponte com calcanhares no sofa':{atlas:'atlas-core',pose:2,equipment:['Sofá firme (apoio)']},
 'prancha frontal':{atlas:'atlas-core',pose:3,equipment:['Peso corporal'],motion:{atlas:'motion-core',row:2}},
 'prancha lateral':{atlas:'atlas-core',pose:4,equipment:['Colchonete']},
 'dead bug':{atlas:'atlas-core',pose:5,equipment:['Colchonete'],motion:{atlas:'motion-core',row:3}},
 'toe taps':{atlas:'atlas-core',pose:5,equipment:['Colchonete'],motion:{atlas:'motion-core',row:3}},
 'bird dog':{atlas:'atlas-core',pose:6,equipment:['Colchonete']},
 'clam shell':{atlas:'atlas-core',pose:7,equipment:['Mini band/elástico circular']},
 'mobilidade de ombro na parede':{atlas:'atlas-core',pose:8,equipment:['Parede']},
 /* Calistenia auditada: apoio, barra e variação corporal correspondem ao quadro mostrado. */
 'flexao na parede':{atlas:'atlas-calisthenics-push-pull',pose:1,equipment:['Parede']},
 'flexao com joelhos apoiados':{atlas:'atlas-calisthenics-push-pull',pose:2,equipment:['Colchonete']},
 'flexao de braco':{atlas:'atlas-calisthenics-push-pull',pose:3,equipment:['Peso corporal']},
 'flexao com pegada fechada':{atlas:'atlas-calisthenics-push-pull',pose:4,equipment:['Peso corporal']},
 'flexao arqueiro':{atlas:'atlas-calisthenics-push-pull',pose:5,equipment:['Peso corporal']},
 'flexao pike':{atlas:'atlas-calisthenics-push-pull',pose:6,equipment:['Peso corporal']},
 'flexao pike com pes elevados':{atlas:'atlas-calisthenics-push-pull',pose:7,equipment:['Cadeira firme']},
 'flexao em parada de mao na parede':{atlas:'atlas-calisthenics-push-pull',pose:8,equipment:['Parede']},
 'flexao hindu':{atlas:'atlas-calisthenics-push-pull',pose:9,equipment:['Peso corporal']},
 'flexao explosiva':{atlas:'atlas-calisthenics-push-pull',pose:10,equipment:['Peso corporal']},
 'depressao escapular na barra':{atlas:'atlas-calisthenics-push-pull',pose:11,equipment:['Barra fixa']},
 'sustentacao ativa na barra':{atlas:'atlas-calisthenics-push-pull',pose:12,equipment:['Barra fixa']},
 'negativa de barra fixa':{atlas:'atlas-calisthenics-push-pull',pose:13,equipment:['Barra fixa']},
 'barra fixa pronada':{atlas:'atlas-calisthenics-push-pull',pose:14,equipment:['Barra fixa']},
 'barra fixa supinada':{atlas:'atlas-calisthenics-push-pull',pose:15,equipment:['Barra fixa']},
 'barra fixa com pegada neutra':{atlas:'atlas-calisthenics-push-pull',pose:16,equipment:['Barra fixa']}
 ,'agachamento sumo':{atlas:'atlas-calisthenics-legs-core',pose:1,equipment:['Peso corporal']}
 ,'agachamento com pausa':{atlas:'atlas-calisthenics-legs-core',pose:2,equipment:['Peso corporal']}
 ,'afundo reverso':{atlas:'atlas-calisthenics-legs-core',pose:3,equipment:['Peso corporal']}
 ,'afundo lateral':{atlas:'atlas-calisthenics-legs-core',pose:4,equipment:['Peso corporal']}
 ,'agachamento dividido':{atlas:'atlas-calisthenics-legs-core',pose:5,equipment:['Peso corporal']}
 ,'agachamento bulgaro':{atlas:'atlas-calisthenics-legs-core',pose:6,equipment:['Cadeira firme']}
 ,'agachamento pistola assistido':{atlas:'atlas-calisthenics-legs-core',pose:7,equipment:['Cadeira firme']}
 ,'agachamento pistola':{atlas:'atlas-calisthenics-legs-core',pose:8,equipment:['Peso corporal']}
 ,'shrimp squat assistido':{atlas:'atlas-calisthenics-legs-core',pose:9,equipment:['Cadeira firme']}
 ,'shrimp squat':{atlas:'atlas-calisthenics-legs-core',pose:10,equipment:['Peso corporal']}
 ,'agachamento cossaco':{atlas:'atlas-calisthenics-legs-core',pose:11,equipment:['Peso corporal']}
 ,'agachamento com salto':{atlas:'atlas-calisthenics-legs-core',pose:12,equipment:['Peso corporal']}
 ,'afundo com salto':{atlas:'atlas-calisthenics-legs-core',pose:13,equipment:['Peso corporal']}
 ,'ponte de gluteos com marcha':{atlas:'atlas-calisthenics-legs-core',pose:14,equipment:['Colchonete']}
 ,'elevacao pelvica com apoio no sofa':{atlas:'atlas-calisthenics-legs-core',pose:15,equipment:['Sofá firme (apoio)']}
 ,'panturrilha no degrau':{atlas:'atlas-calisthenics-legs-core',pose:16,equipment:['Degrau/escada']}
 ,'the hundred adaptado':{atlas:'atlas-pilates-mat',pose:1,equipment:['Colchonete']}
 ,'ponte de ombros (pilates)':{atlas:'atlas-pilates-mat',pose:2,equipment:['Colchonete']}
 ,'toe taps':{atlas:'atlas-pilates-mat',pose:3,equipment:['Colchonete']}
 ,'single leg stretch':{atlas:'atlas-pilates-mat',pose:4,equipment:['Colchonete']}
 ,'clam shell':{atlas:'atlas-pilates-mat',pose:5,equipment:['Colchonete']}
 ,'natacao (swimming)':{atlas:'atlas-pilates-mat',pose:6,equipment:['Colchonete']}
 ,'gato-vaca':{atlas:'atlas-pilates-mat',pose:7,equipment:['Colchonete']}
 ,'roll down na parede':{atlas:'atlas-pilates-mat',pose:8,equipment:['Parede']}
 ,'circulos com a perna':{atlas:'atlas-pilates-mat',pose:9,equipment:['Colchonete']}
 ,'prancha de quatro apoios':{atlas:'atlas-pilates-mat',pose:10,equipment:['Colchonete']}
 ,'mermaid stretch':{atlas:'atlas-pilates-mat',pose:11,equipment:['Colchonete']}
 ,'roll up assistido':{atlas:'atlas-pilates-mat',pose:12,equipment:['Colchonete']}
 ,'half roll back':{atlas:'atlas-pilates-mat',pose:13,equipment:['Colchonete']}
 ,'saw (serrote)':{atlas:'atlas-pilates-mat',pose:14,equipment:['Colchonete']}
 ,'spine twist sentado':{atlas:'atlas-pilates-mat',pose:15,equipment:['Colchonete']}
 ,'serie de chutes laterais':{atlas:'atlas-pilates-mat',pose:16,equipment:['Colchonete']}
 ,'respiracao 360°':{atlas:'atlas-diastasis-gentle',pose:1,equipment:['Colchonete']}
 ,'deslize de calcanhar controlado':{atlas:'atlas-diastasis-gentle',pose:2,equipment:['Colchonete']}
 ,'bent knee fallout controlado':{atlas:'atlas-diastasis-gentle',pose:3,equipment:['Colchonete']}
 ,'marcha supina com ativacao':{atlas:'atlas-diastasis-gentle',pose:4,equipment:['Colchonete']}
 ,'quadrupedia com ativacao suave':{atlas:'atlas-diastasis-gentle',pose:5,equipment:['Colchonete']}
 ,'pressao de parede com expiracao':{atlas:'atlas-diastasis-gentle',pose:6,equipment:['Parede']}
 ,'sentar e levantar com expiracao':{atlas:'atlas-diastasis-gentle',pose:7,equipment:['Cadeira firme']}
 ,'dead bug de calcanhar no solo':{atlas:'atlas-diastasis-gentle',pose:8,equipment:['Colchonete']}
 ,'remada com elastico':{atlas:'atlas-elastics',pose:3,equipment:['Elásticos']}
 ,'puxada com elastico':{atlas:'atlas-elastics',pose:4,equipment:['Elásticos']}
 ,'pallof press com elastico':{atlas:'atlas-elastics',pose:5,equipment:['Elásticos longos']}
 ,'extensao de quadril com elastico':{atlas:'atlas-elastics',pose:6,equipment:['Elásticos longos']}
 ,'agachamento com mini band':{atlas:'atlas-elastics',pose:7,equipment:['Mini band/elástico circular']}
 ,'ponte com mini band':{atlas:'atlas-elastics',pose:8,equipment:['Mini band/elástico circular']}
 ,'abducao em pe com elastico':{atlas:'atlas-elastics',pose:9,equipment:['Mini band/elástico circular']}
 ,'face pull com elastico':{atlas:'atlas-elastics',pose:10,equipment:['Elásticos longos']}
 ,'supino com elastico':{atlas:'atlas-elastics',pose:11,equipment:['Elásticos longos']}
 ,'rosca biceps com elastico':{atlas:'atlas-elastics',pose:12,equipment:['Elásticos longos']}
 ,'triceps acima da cabeca com elastico':{atlas:'atlas-elastics',pose:13,equipment:['Elásticos longos']}
 ,'pilates: abertura de bracos com elastico':{atlas:'atlas-elastics',pose:14,equipment:['Elásticos longos']}
 ,'pilates: puxada sentada com elastico':{atlas:'atlas-elastics',pose:15,equipment:['Elásticos longos']}
 ,'dorsiflexao com elastico':{atlas:'atlas-elastics',pose:16,equipment:['Elásticos']}
 ,'abdominal no cabo':{atlas:'atlas-academy-complete',pose:1,equipment:['Cabo/polia']}
 ,'bom dia no smith':{atlas:'atlas-academy-complete',pose:2,equipment:['Máquinas']}
 ,'cadeira abdutora':{atlas:'atlas-academy-complete',pose:3,equipment:['Máquinas']}
 ,'desenvolvimento com halteres':{atlas:'atlas-academy-complete',pose:4,equipment:['Halteres']}
 ,'desenvolvimento sentado com halteres':{atlas:'atlas-academy-complete',pose:5,equipment:['Halteres']}
 ,'elevação lateral':{atlas:'atlas-academy-complete',pose:6,equipment:['Halteres']}
 ,'elevação lateral na máquina':{atlas:'atlas-academy-complete',pose:7,equipment:['Máquinas']}
 ,'elevação pélvica com barra':{atlas:'atlas-academy-complete',pose:8,equipment:['Barra e anilhas']}
 ,'hiperextensão no banco':{atlas:'atlas-academy-complete',pose:9,equipment:['Banco']}
 ,'leg press':{atlas:'atlas-academy-complete',pose:10,equipment:['Máquinas']}
 ,'levantamento terra romeno':{atlas:'atlas-academy-complete',pose:11,equipment:['Halteres']}
 ,'panturrilha sentada na máquina':{atlas:'atlas-academy-complete',pose:12,equipment:['Máquinas']}
 ,'pulldown com braços estendidos':{atlas:'atlas-academy-complete',pose:13,equipment:['Cabo/polia']}
 ,'remada baixa':{atlas:'atlas-academy-complete',pose:14,equipment:['Cabo/polia']}
 ,'rosca alternada':{atlas:'atlas-academy-complete',pose:15,equipment:['Halteres']}
 ,'rosca concentração':{atlas:'atlas-academy-complete',pose:16,equipment:['Halteres']}
 ,'rosca direta':{atlas:'atlas-academy-arms',pose:1,equipment:['Barra e anilhas']}
 ,'rosca inversa':{atlas:'atlas-academy-arms',pose:2,equipment:['Barra e anilhas']}
 ,'rosca martelo':{atlas:'atlas-academy-arms',pose:3,equipment:['Halteres']}
 ,'rosca no cabo':{atlas:'atlas-academy-arms',pose:4,equipment:['Cabo/polia']}
 ,'rosca Scott na máquina':{atlas:'atlas-academy-arms',pose:5,equipment:['Máquinas']}
 ,'rotação externa no cabo':{atlas:'atlas-academy-arms',pose:6,equipment:['Cabo/polia']}
 ,'supino na máquina':{atlas:'atlas-academy-arms',pose:7,equipment:['Máquinas']}
 ,'tríceps na polia':{atlas:'atlas-academy-arms',pose:8,equipment:['Cabo/polia']}
 ,'woodchop no cabo':{atlas:'atlas-academy-arms',pose:9,equipment:['Cabo/polia']}
 ,'abdominal reverso':{atlas:'atlas-calisthenics-complete',pose:1,equipment:['Colchonete']}
 ,'abdução com elástico':{atlas:'atlas-calisthenics-complete',pose:2,equipment:['Elásticos']}
 ,'agachamento controlado':{atlas:'atlas-calisthenics-complete',pose:3,equipment:['Peso corporal']}
 ,'caminhada lateral com elástico':{atlas:'atlas-calisthenics-complete',pose:4,equipment:['Elásticos']}
 ,'elevação de pernas deitado':{atlas:'atlas-calisthenics-complete',pose:5,equipment:['Colchonete']}
 ,'elevação de quadril':{atlas:'atlas-calisthenics-complete',pose:6,equipment:['Peso corporal']}
 ,'flexão arqueiro assistida':{atlas:'atlas-calisthenics-complete',pose:7,equipment:['Peso corporal']}
 ,'flexão com pausa no fundo':{atlas:'atlas-calisthenics-complete',pose:8,equipment:['Peso corporal']}
 ,'flexão com pegada aberta':{atlas:'atlas-calisthenics-complete',pose:9,equipment:['Peso corporal']}
 ,'hollow hold':{atlas:'atlas-calisthenics-complete',pose:10,equipment:['Colchonete']}
 ,'hollow rock':{atlas:'atlas-calisthenics-complete',pose:11,equipment:['Colchonete']}
 ,'panturrilha unilateral':{atlas:'atlas-calisthenics-complete',pose:12,equipment:['Peso corporal']}
 ,'prancha bear':{atlas:'atlas-calisthenics-complete',pose:13,equipment:['Colchonete']}
 ,'prancha reversa':{atlas:'atlas-calisthenics-complete',pose:14,equipment:['Colchonete']}
 ,'remada australiana com pés elevados':{atlas:'atlas-calisthenics-complete',pose:15,equipment:['Barra fixa']}
 ,'remada australiana supinada':{atlas:'atlas-calisthenics-complete',pose:16,equipment:['Barra fixa']}
 ,'y-t-w em pronação':{atlas:'atlas-care-foundations',pose:1,equipment:['Colchonete']}
 ,'abertura de joelho controlada':{atlas:'atlas-care-foundations',pose:2,equipment:['Colchonete']}
 ,'ativação profunda do core':{atlas:'atlas-care-foundations',pose:3,equipment:['Colchonete']}
 ,'extensão de joelho':{atlas:'atlas-care-foundations',pose:4,equipment:['Máquinas']}
 ,'ponte de glúteos unilateral':{atlas:'atlas-care-foundations',pose:5,equipment:['Colchonete']}
 ,'dead bug':{atlas:'atlas-care-foundations',pose:6,equipment:['Colchonete']}
 ,'prancha frontal':{atlas:'atlas-care-foundations',pose:7,equipment:['Peso corporal','Colchonete']}
 ,'alongamento de posterior':{atlas:'atlas-care-foundations',pose:8,equipment:['Colchonete']}
 ,'mobilidade de ombro na parede':{atlas:'atlas-care-foundations',pose:9,equipment:['Peso corporal']}
 ,'mobilidade de quadril 90/90':{atlas:'atlas-care-mobility',pose:1,equipment:['Colchonete']}
 ,'mobilidade de tornozelo':{atlas:'atlas-care-mobility',pose:2,equipment:['Peso corporal']}
 ,'rotação externa':{atlas:'atlas-care-mobility',pose:3,equipment:['Elásticos']}
 ,'retração cervical suave':{atlas:'atlas-care-mobility',pose:4,equipment:['Peso corporal']}
 ,'rotação cervical confortável':{atlas:'atlas-care-mobility',pose:5,equipment:['Peso corporal']}
 ,'ponte de ombros unilateral':{atlas:'atlas-care-mobility',pose:6,equipment:['Colchonete']}
 ,'teaser preparatório':{atlas:'atlas-care-mobility',pose:7,equipment:['Colchonete']}
 ,'equilíbrio em um pé':{atlas:'atlas-care-mobility',pose:8,equipment:['Peso corporal']}
 ,'toe taps':{atlas:'toe-taps-specific',pose:1,equipment:['Colchonete']}
};
const mfAuditedVisualIndex=Object.fromEntries(Object.entries(mfAuditedVisualCatalog).map(([name,record])=>[mfIllustrationText(name),record]));
function mfAuditedVisualRecord(exercise){const record=mfAuditedVisualIndex[mfIllustrationText(exercise?.name)],current=mfIllustrationText(exercise?.equip).replace(/\s*\([^)]*\)\s*$/,'').trim();return record&&record.equipment.some(item=>{const expected=mfIllustrationText(item);return expected===current||current.startsWith(expected)||expected.startsWith(current)})?record:null}
function exerciseIllustrationMarkup(exercise,compact=false){const visual=mfAuditedVisualRecord(exercise),label=escapeHTML(exercise?.name||'movimento'),demo=encodeURIComponent(exercise?.youtube||exercise?.name||'exercício'),href=`https://www.youtube.com/results?search_query=${demo}`;if(!visual)return `<a class="${compact?'exercise-glyph ':''}exercise-illustration exercise-illustration-unavailable" href="${href}" target="_blank" rel="noopener" aria-label="Abrir demonstração em vídeo: ${label}" title="Abrir demonstração em vídeo"><span aria-hidden="true">▶</span><small>Vídeo</small></a>`;const motion=visual.motion,classes=[compact?'exercise-glyph':'','exercise-illustration',visual.atlas,`pose-${visual.pose}`,motion?.atlas,motion&&`motion-row-${motion.row}`].filter(Boolean).join(' '),type=motion?'Animação demonstrativa em loop':'Ilustração demonstrativa';return `<a class="${classes}" href="${href}" target="_blank" rel="noopener" aria-label="Abrir vídeo — ${type}: ${label}" title="Abrir demonstração em vídeo"></a>`}
function formatDiastasisTime(seconds){return new Date(Math.max(seconds,0)*1000).toISOString().slice(14,19)}
function renderDiastasisRoutine(){const host=$('#diastasisRoutine');if(!host)return;const sequence=['Respiração 360°','Ativação profunda do core','Deslize de calcanhar controlado'].map(name=>exercises.find(e=>e.name===name)).filter(Boolean);const started=diastasisSequenceStep!==null;const current=sequence[diastasisSequenceStep];const start=$('#startDiastasis'),reset=$('#resetDiastasis'),timer=$('#diastasisTimer');start.hidden=started;reset.hidden=!started;if(!started){host.innerHTML=`<div class="routine-overview"><span><b>1</b> Respirar</span><i>→</i><span><b>2</b> Ativar</span><i>→</i><span><b>3</b> Mover</span></div><p class="routine-note">Comece quando estiver confortável. Cada etapa aparece sozinha, com a orientação e a demonstração daquele exercício.</p>`;timer.hidden=true;return}if(!current){host.innerHTML=`<div class="routine-complete"><span>✓</span><div><h3>Sequência concluída</h3><p>Ótimo. Anote como seu corpo respondeu e mantenha a progressão gradual.</p></div></div>`;timer.hidden=true;reset.hidden=false;return}const dose=current.detail.replace(/^2 séries · /,'');host.innerHTML=`<article class="routine-current"><div class="routine-progress"><span>ETAPA ${diastasisSequenceStep+1} DE ${sequence.length}</span><div>${sequence.map((_,i)=>`<i class="${i<=diastasisSequenceStep?'done':''}"></i>`).join('')}</div></div><div class="routine-current-main"><div class="exercise-visual">${exerciseIllustrationMarkup(current)}</div><div><p class="eyebrow">EXERCÍCIO ATUAL</p><h3>${current.name}</h3><p>${current.area}</p><strong>${dose}</strong></div></div><p class="routine-instruction">${['Respire expandindo costelas e abdômen suavemente; na expiração, deixe o abdômen inferior ativar sem prender o ar.','Ao expirar, faça uma contração leve do assoalho pélvico e do abdômen baixo; relaxe por completo antes da próxima repetição.','De costas e com joelhos flexionados, deslize um calcanhar devagar e retorne sem perder o conforto ou o controle da pelve.'][diastasisSequenceStep]}</p><div class="guide-actions"><a class="outline routine-demo" target="_blank" href="https://www.youtube.com/results?search_query=${current.youtube}">▶ Ver demonstração</a><button class="primary" type="button" id="nextDiastasis">${diastasisSequenceStep===sequence.length-1?'Concluir sequência ✓':'Próximo exercício →'}</button></div></article>`;timer.hidden=false;timer.innerHTML=`<strong>Tempo da sequência</strong><span>${formatDiastasisTime(diastasisSeconds)}</span>`;$('#nextDiastasis').onclick=()=>{diastasisSequenceStep++;renderDiastasisRoutine();if(diastasisSequenceStep>=sequence.length){clearInterval(diastasisTimerId);diastasisTimerId=null;toast('Sequência concluída. Registre como seu corpo respondeu.')}}}
function startDiastasisRoutine(){if(diastasisTimerId)clearInterval(diastasisTimerId);diastasisSequenceStep=0;diastasisSeconds=300;diastasisTimerId=setInterval(()=>{diastasisSeconds--;const timer=$('#diastasisTimer span');if(timer)timer.textContent=formatDiastasisTime(diastasisSeconds);if(diastasisSeconds<=0){clearInterval(diastasisTimerId);diastasisTimerId=null;toast('O tempo terminou. Continue apenas se ainda estiver confortável.')}},1000);renderDiastasisRoutine();toast('Comece pela respiração e avance somente se estiver confortável.')}
function renderExercises(filter='Todos'){$('#exerciseGrid').innerHTML=exercises.filter(e=>filter==='Todos'||e.cat===filter||(filter==='Elásticos'&&/elástico/i.test(e.equip))).map(exerciseCardMarkup).join('')||'<p>Nenhum exercício nesse filtro.</p>';$$('[data-library-exercise]').forEach(button=>button.onclick=()=>{if(typeof window.mfToggleLibraryExercise==='function')window.mfToggleLibraryExercise(button.dataset.libraryExercise);else toast('A área Treino está sendo preparada. Tente novamente.')} )}
function renderWorkout(){const host=$('#validatedSheets');if(!host)return;const sheets=(db.sheets||[]).map((sheet,index)=>({sheet,index})).filter(({sheet})=>sheet.reviewed);host.hidden=!$('#workoutResult').hidden;if(!sheets.length){host.innerHTML='';return}host.innerHTML=`<article class="panel ready-sheets"><div><p class="eyebrow">FICHAS PRONTAS PARA HOJE</p><h2>Escolha uma ficha validada</h2><p class="hint">Você pode seguir exatamente a prescrição ou responder ao check-in para receber uma versão adaptada ao seu dia.</p></div><div class="ready-sheet-list">${sheets.map(({sheet,index})=>{const count=(sheet.items?.length||parseSheet(sheet.raw||'').length);return `<article class="ready-sheet"><div><strong>${escapeHTML(sheet.name)}</strong><small>${count} itens · revisada por você</small></div><div class="sheet-actions"><button class="outline" data-start-ready-sheet="${index}">Seguir ficha</button><button class="primary" data-adapt-ready-sheet="${index}">Adaptar ao meu dia</button></div></article>`}).join('')}</div></article>`;$$('[data-start-ready-sheet]').forEach(button=>button.onclick=()=>startSheetWorkout(+button.dataset.startReadySheet,false));$$('[data-adapt-ready-sheet]').forEach(button=>button.onclick=()=>prepareSheetAdaptation(+button.dataset.adaptReadySheet))}
function energyText(v){return ['','Muito baixa','Baixa','Moderada','Boa','Muito boa'][v]}
function setEnergy(value){$('#energy').value=value;$$('#energyChoices [data-energy]').forEach(button=>button.classList.toggle('selected',+button.dataset.energy===+value))}
const painBands=[{value:0,range:'0',label:'Sem dor',guidance:'treino normal'},{value:2,range:'1–2',label:'Leve',guidance:'movimento confortável'},{value:4,range:'3–4',label:'Moderada',guidance:'treino adaptado'},{value:6,range:'5–6',label:'Forte',guidance:'reduzir ou substituir'},{value:8,range:'7–8',label:'Muito forte',guidance:'interromper o treino da região'},{value:10,range:'9–10',label:'Intensa',guidance:'não treinar; procure avaliação se for súbita'}];
function exerciseIsAffectedByPain(exercise,area){const care=Array.isArray(exercise?.care)?exercise.care:[];if(care.includes(area))return true;if(area.startsWith('Pescoço'))return exercise.cat==='Pescoço'||/pescoço|ombro|costas|postura|peito|tríceps|prancha|barra fixa|remada|puxada|supino|desenvolvimento|face pull|mergulho|natação/i.test(`${exercise.name} ${exercise.area}`);return exercise.cat===area||exercise.area.includes(area)}
function painKey(area){return area.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function painInputId(area){return `pain-${painKey(area)}`}
function painStatusId(area){return `pain-status-${painKey(area)}`}
function renderPainInputs(){const host=$('#painInputs');host.innerHTML=limitations.map(area=>`<article class="pain-card"><strong>${area}</strong><input id="${painInputId(area)}" type="hidden" value="0"><div class="pain-bands" data-pain-area="${area}">${painBands.map((band,index)=>`<button type="button" class="${index===0?'selected':''}" data-pain-value="${band.value}"><b>${band.range}</b><span>${band.label}</span></button>`).join('')}</div><small id="${painStatusId(area)}">${painBands[0].range} · ${painBands[0].label} — ${painBands[0].guidance}</small></article>`).join('');$$('.pain-bands').forEach(group=>group.querySelectorAll('[data-pain-value]').forEach(button=>button.onclick=()=>{const area=group.dataset.painArea,value=+button.dataset.painValue,band=painBands.find(item=>item.value===value);$(`#${painInputId(area)}`).value=value;group.querySelectorAll('[data-pain-value]').forEach(choice=>choice.classList.toggle('selected',choice===button));$(`#${painStatusId(area)}`).textContent=`${band.range} · ${band.label} — ${band.guidance}`}))}
function getTodayEquipment(){return [...$$('#todayEquipment input:checked')].map(input=>input.value)}
function supportsEquipment(required,available=[]){if(required==='Peso corporal'||required==='Colchonete'||required==='Parede')return true;const aliases={Banco:['Banco','Cadeira firme','Sofá firme (apoio)','Degrau/escada'],Elásticos:['Elásticos longos','Mini band/elástico circular'],'Elásticos longos':['Elásticos longos'],'Mini band/elástico circular':['Mini band/elástico circular'],Máquinas:['Máquinas','Academia completa'],'Cabo/polia':['Cabo/polia','Academia completa'],Halteres:['Halteres','Academia completa'],'Barra e anilhas':['Barra e anilhas','Academia completa'],'Barra fixa':['Barra fixa','Academia completa'],Paralelas:['Paralelas','Academia completa'],Kettlebell:['Kettlebell'],Corda:['Corda'],TRX:['TRX/argolas'],'Bola suíça/Pilates':['Bola suíça/Pilates'],'Mini bola de Pilates':['Mini bola de Pilates']};return (aliases[required]||[required]).some(item=>available.includes(item))}
function generateWorkout(){
 const pain={};limitations.forEach(x=>pain[x]=+($(`#${painInputId(x)}`)?.value||0));
 const energy=+$('#energy').value;
 const selectedEquipment=getTodayEquipment();
 const todayNote=$('#todayNotes').value.trim();
 const severe=Object.entries(pain).filter(([,v])=>v>=8).map(([x])=>x);
 const high=Object.entries(pain).filter(([,v])=>v>=6&&v<8).map(([x])=>x);
 const moderate=Object.entries(pain).filter(([,v])=>v>=4&&v<6).map(([x])=>x);
 let pool=[...exercises];
 if(high.length||severe.length)pool=pool.filter(e=>![...high,...severe].some(x=>exerciseIsAffectedByPain(e,x)));
 const accessiblePool=pool.filter(e=>supportsEquipment(e.equip,selectedEquipment));
 let base=accessiblePool.filter(e=>e.cat==='Calistenia').slice(0,4);
 if(base.length<4)base=base.concat(accessiblePool.filter(e=>e.cat==='Academia').slice(0,4-base.length));
 if(base.length<4)base=base.concat(pool.filter(e=>['Calistenia','Academia'].includes(e.cat)&&!base.includes(e)).slice(0,4-base.length));
 const diastasisCore=exercises.find(e=>e.name==='Respiração 360°');
 if(db.profile.diastasisFocus&&diastasisCore){base=base.filter(e=>e.name!=='Prancha frontal');base.push(diastasisCore)}else{const plank=exercises.find(e=>e.name==='Prancha frontal');if(plank)base.push(plank)}
 if(energy<=2)base=base.slice(0,4);
 const volume=energy<=2||moderate.length?'2 séries':'3 séries';
 const warnings=[...severe.map(x=>`${x}: dor muito forte/intensa — não recomendo treinar essa região hoje; procure avaliação se a dor for súbita, intensa ou piorar.`),...high.map(x=>x.startsWith('Pescoço')?'Pescoço/cervical: exercícios que exigem sustentação de cabeça, pescoço ou ombros foram retirados.':`${x}: exercícios de impacto/carga direta foram retirados.`),...moderate.map(x=>`${x}: volume reduzido e execução mais controlada.`),...(selectedEquipment.length?[`Equipamentos considerados: ${selectedEquipment.join(', ')}.`]:['Sem equipamento marcado: priorizei peso corporal.']),...(todayNote?[`Observação do dia: ${escapeHTML(todayNote)}`]:[]),...(db.profile.diastasisFocus?['Foco em core profundo: sem prancha nesta sugestão; pare se surgir abaulamento abdominal.']:[])];
 $('#checkinBox').hidden=true;$('#validatedSheets').hidden=true;$('#workoutResult').hidden=false;$('#newCheckin').hidden=false;
 $('#workoutResult').innerHTML=`<article class="workout-card"><div class="workout-top"><div><p class="eyebrow">TREINO ADAPTADO</p><h2>${db.profile.goal||'Força'} · ${db.profile.duration||45} min</h2><p>Energia ${energyText(energy).toLowerCase()} · ${$('#sleep').selectedOptions[0].text} de sono</p></div><div class="adaptation-note">${warnings.length?warnings.join('<br>'):'Corpo sem alertas importantes hoje. Treino padrão liberado.'}</div></div><p class="equipment-helper">As trocas abaixo foram filtradas pelos equipamentos que você marcou no check-in.</p><div class="workout-items">${base.map((e,i)=>{const allSwaps=equipmentSwaps[e.name]||[{name:e.name,equip:e.equip,detail:e.detail}];const swaps=allSwaps.filter(s=>supportsEquipment(s.equip,selectedEquipment));const usableSwaps=swaps.length?swaps:allSwaps;return `<article class="workout-item"><span class="exercise-glyph">${e.glyph}</span><div class="workout-exercise"><h3 id="swap-name-${i}">${i+1}. ${e.name}</h3><p id="swap-detail-${i}">${volume} · ${e.detail.split('·').at(-1).trim()} · 60s descanso</p><small id="swap-equip-${i}">${high.length||severe.length?'Alternativa adaptada para seu check-in':'Equipamento: '+e.equip}</small><label class="swap-label">Trocar equipamento/exercício<select class="equipment-swap" data-swap="${i}">${usableSwaps.map((s,n)=>`<option value="${n}">${s.equip} — ${s.name}</option>`).join('')}</select></label><script type="application/json" id="swap-options-${i}">${JSON.stringify(usableSwaps)}</script></div><button class="outline" data-youtube="${e.youtube}">Demo</button></article>`}).join('')}</div><button class="primary finish-workout" id="finishWorkout">Concluir treino ✓</button></article>`;
 $$('[data-youtube]').forEach(b=>b.onclick=()=>window.open(`https://www.youtube.com/results?search_query=${b.dataset.youtube}`,'_blank'));
 $$('.equipment-swap').forEach(s=>s.onchange=()=>{const i=s.dataset.swap,choices=JSON.parse($(`#swap-options-${i}`).textContent),selectedChoice=choices[+s.value];$(`#swap-name-${i}`).textContent=`${+i+1}. ${selectedChoice.name}`;$(`#swap-detail-${i}`).textContent=`${volume} · ${selectedChoice.detail.split('·').at(-1).trim()} · 60s descanso`;$(`#swap-equip-${i}`).textContent=`Equipamento: ${selectedChoice.equip}`;toast('Exercício ajustado ao equipamento escolhido')});
 $('#finishWorkout').onclick=()=>{db.workouts.push({date:iso(),energy,pain,note:todayNote});save();toast('Treino concluído. Ótimo trabalho!')};
}
function attachWorkoutTimer(){const host=$('#workoutResult');if(!host||$('#timerDisplay'))return;host.insertAdjacentHTML('afterbegin',`<div class="timer-card"><span>⏱</span><strong id="timerDisplay">00:00</strong><button class="outline" id="timerStart">Iniciar cronômetro</button><button class="text-button" id="timerReset">Zerar</button></div>`);let seconds=0,interval;$('#timerStart').onclick=()=>{const b=$('#timerStart');if(interval){clearInterval(interval);interval=null;b.textContent='Continuar'}else{interval=setInterval(()=>{seconds++;$('#timerDisplay').textContent=new Date(seconds*1000).toISOString().slice(14,19)},1000);b.textContent='Pausar'}};$('#timerReset').onclick=()=>{clearInterval(interval);interval=null;seconds=0;$('#timerDisplay').textContent='00:00';$('#timerStart').textContent='Iniciar cronômetro'}}
function renderProgress(){const w=db.weights.at(-1)?.value||db.profile.weight;$('#progressWeight').textContent=w?`${w} kg`:'—';$('#assessmentCount').textContent=db.assessments.length;$('#progressWorkouts').textContent=db.workouts.length;let vals=db.weights.slice(-8);if(vals.length<2){$('#weightChart').innerHTML='<p>Registre ao menos dois pesos para ver seu gráfico.</p>'}else{let min=Math.min(...vals.map(x=>+x.value)),max=Math.max(...vals.map(x=>+x.value));$('#weightChart').innerHTML=vals.map(x=>{let h=max===min?55:25+75*((x.value-min)/(max-min));return `<div class="bar-wrap"><div class="bar" style="height:${h}%" title="${x.value} kg"></div><small>${new Date(x.date+'T12:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</small></div>`}).join('')}$('#weightHistory').innerHTML=[...db.weights].reverse().map(x=>`<div class="history-row"><span>${new Date(x.date+'T12:00').toLocaleDateString('pt-BR')}</span><strong>${x.value} kg</strong></div>`).join('');$('#photoGrid').innerHTML=db.photos.map(x=>`<img src="${x.data}" alt="Foto de evolução de ${x.date}">`).join('')||'<p class="hint">Você ainda não adicionou fotos.</p>'}
const nutritionMealSlots=[
 {id:'breakfast',label:'Café da manhã',icon:'☀',types:['Café da manhã'],period:'Café da manhã'},
 {id:'lunch',label:'Almoço',icon:'♨',types:['Almoço'],period:'Almoço'},
 {id:'snack',label:'Lanche da tarde',icon:'◒',types:['Lanche da manhã','Lanche da tarde'],period:'Lanche da tarde'},
 {id:'night',label:'Jantar / lanche noturno',icon:'☾',types:['Jantar','Ceia'],period:'Jantar / lanche noturno'}
];
function nutritionNow(){const now=new Date();return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`}
function nutritionDateLabel(value){return new Date(`${value}T12:00`).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}
function nutritionWeekDates(){const selected=new Date(`${nutritionDate}T12:00`),start=new Date(selected);start.setDate(selected.getDate()-selected.getDay());return Array.from({length:7},(_,index)=>{const day=new Date(start);day.setDate(start.getDate()+index);return day})}
const nutritionRecipeGuides={
 'Café da manhã':{title:'Café da manhã com energia estável',hint:'Foco: proteína + carboidrato com fibra. Exemplos: ovos, iogurte ou queijo acompanhados de pão integral, aveia, tapioca, cuscuz ou fruta.'},
 'Almoço':{title:'Almoço completo',hint:'Foco: vegetais + fonte de proteína + carboidrato. As sugestões formam um prato de verdade, não um lanche disfarçado.'},
 'Lanche da tarde':{title:'Lanche da tarde prático',hint:'Foco: fruta, fibra e proteína para dar saciedade até a próxima refeição. As opções aqui não substituem um almoço ou jantar completo.'},
 'Jantar / lanche noturno':{title:'Jantar leve e nutritivo',hint:'Foco: proteína e vegetais de fácil digestão. Esta lista não mostra receitas de café da manhã; a ideia é terminar o dia com uma refeição coerente.'}
};
function recipeMealPeriodFor(recipe){
 const name=normalizeText(recipe[1]),category=normalizeText(recipe[2]);
 const breakfastNames=/omelete de aveia|panqueca de banana|overnight|tapioca|torrada|vitamina|cuscuz com|crepioca|mingau|waffle|bolo de caneca/;
 const snackNames=/iogurte|mousse|maca com|muffin|pipoca|cookie|sorvete|mini pizza|banana assada|tostex|taca de|sanduiche de ovo|wrap proteico/;
 const dinnerNames=/abobrinha recheada|sopa |peixe com legumes|frango com brocolis|ovos mexidos mediterraneos|rolinho de alface|moqueca|salada morna|ovos assados|berinjela recheada|lasanha de abobrinha|shakshuka|quiche|escondidinho de cogumelos|pimentao recheado|arroz cremoso de abobora/;
 if(category==='lanche')return 'Lanche da tarde';
 if(category==='cafe da manha'||breakfastNames.test(name))return 'Café da manhã';
 if(snackNames.test(name))return 'Lanche da tarde';
 if(dinnerNames.test(name))return 'Jantar / lanche noturno';
 return 'Almoço';
}
function recipeMatchesMealPeriod(recipe,period){return recipeMealPeriodFor(recipe)===period}
function recipeCategoryForPeriod(recipe,period){
 const category=recipe[2];
 if(period==='Café da manhã')return category==='Baixo custo'?'Baixo custo':'Café da manhã';
 if(period==='Almoço'&&category==='Hipertrofia')return 'Proteico';
 if(period==='Lanche da tarde'&&category==='Baixo custo')return 'Baixo custo';
 if(period==='Jantar / lanche noturno'&&category==='Emagrecimento')return 'Leve';
 return category;
}
function nutritionMealTypeForPeriod(period){return period==='Jantar / lanche noturno'?'Jantar':period}
function renderNutrition(){
 const selectedMeals=(db.meals||[]).filter(meal=>meal.date===nutritionDate),selectedCalories=selectedMeals.reduce((sum,meal)=>sum+(+meal.calories||0),0);
 $('#todayCalories').textContent=selectedCalories;$('#nutritionCaloriesLabel').textContent=`kcal registradas em ${new Date(`${nutritionDate}T12:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}`;$('#waterCount').textContent=db.water;
 $('#nutritionSelectedDate').textContent=`${nutritionDateLabel(nutritionDate)} · toque em um horário para registrar ou planejar.`;
 $('#nutritionWeek').innerHTML=nutritionWeekDates().map(day=>{const key=day.toISOString().slice(0,10),count=(db.meals||[]).filter(meal=>meal.date===key).length;return `<button class="nutrition-day ${key===nutritionDate?'selected':''} ${key===iso()?'today':''}" data-nutrition-date="${key}"><small>${day.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</small><b>${day.getDate()}</b><span>${count?`${count} refeição${count>1?'ões':''}`:'—'}</span></button>`}).join('');
 $('#mealSlots').innerHTML=nutritionMealSlots.map(slot=>{const entries=selectedMeals.filter(meal=>slot.types.includes(meal.type));return `<button class="meal-slot" data-meal-slot="${slot.id}"><span class="meal-slot-icon">${slot.icon}</span><span><strong>${slot.label}</strong><small>${entries.length?entries.map(meal=>`${meal.time?meal.time+' · ':''}${escapeHTML(meal.food)}`).join(' · '):'Toque para adicionar alimentos'}</small></span><b>${entries.length?`${entries.length} ✓`:'＋'}</b></button>`}).join('');
 $('#mealListTitle').textContent=`Refeições de ${new Date(`${nutritionDate}T12:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'long'})}`;
 $('#mealList').innerHTML=selectedMeals.length?selectedMeals.slice().sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')).map(meal=>`<div class="meal-row"><span><strong>${escapeHTML(meal.type)}${meal.time?` · ${escapeHTML(meal.time)}`:''}</strong><br><small>${escapeHTML(meal.food)}${meal.photoMediaId||meal.photo?' · foto registrada':''}</small></span><strong>${meal.calories?meal.calories+' kcal':'—'}</strong></div>`).join(''):'<p class="empty">Nenhuma refeição registrada neste dia. Toque em um horário acima para começar.</p>';
 const periodRecipes=recipes.map((recipe,index)=>({recipe,index,periodCategory:recipeCategoryForPeriod(recipe,recipeMealPeriod)})).filter(item=>recipeMatchesMealPeriod(item.recipe,recipeMealPeriod)),categories=['Todos',...new Set(periodRecipes.map(item=>item.periodCategory))];if(!categories.includes(recipeFilter))recipeFilter='Todos';
 const guide=nutritionRecipeGuides[recipeMealPeriod];
 $('#recipePeriodTitle').textContent=guide.title;
 $('#recipePeriodHint').textContent=guide.hint;
 $('#recipePeriods').innerHTML=nutritionMealSlots.map(slot=>`<button class="${slot.period===recipeMealPeriod?'selected':''}" data-recipe-period="${slot.period}">${slot.icon} ${slot.label}</button>`).join('');
 $('#recipeFilters').innerHTML=categories.map(category=>`<button class="${category===recipeFilter?'selected':''}" data-recipe-filter="${category}">${category}</button>`).join('');
 const filtered=periodRecipes.filter(item=>recipeFilter==='Todos'||item.periodCategory===recipeFilter);
 $('#recipeGrid').innerHTML=filtered.map(({recipe,index,periodCategory})=>`<button class="recipe" data-recipe="${index}" aria-label="Ver receita: ${escapeHTML(recipe[1])}"><div class="recipe-top">${recipe[0]}<span>${recipe[6]}</span></div><div><span class="tag">${periodCategory}</span><h3>${recipe[1]}</h3><p>${recipe[3]} · ${recipe[6]}</p><span class="text-button">Ver receita →</span></div></button>`).join('')||'<p class="empty">Ainda não há receita nessa combinação.</p>';
 renderNutritionPlans();
 $$('[data-nutrition-date]').forEach(button=>button.onclick=()=>{nutritionDate=button.dataset.nutritionDate;renderNutrition()});$$('[data-meal-slot]').forEach(button=>button.onclick=()=>{const slot=nutritionMealSlots.find(item=>item.id===button.dataset.mealSlot);recipeMealPeriod=slot.period;recipeFilter='Todos';addMealModal(slot.types[0])});$$('[data-recipe-period]').forEach(button=>button.onclick=()=>{recipeMealPeriod=button.dataset.recipePeriod;recipeFilter='Todos';renderNutrition()});$$('[data-recipe-filter]').forEach(button=>button.onclick=()=>{recipeFilter=button.dataset.recipeFilter;renderNutrition()});$$('[data-recipe]').forEach(button=>button.onclick=()=>showRecipe(+button.dataset.recipe));
}
function nutritionPlanFileLabel(plan){return plan.type==='application/pdf'?'PDF':plan.type?.startsWith('image/')?'Imagem':'Arquivo'}
function renderNutritionPlans(){const host=$('#nutritionPlanList');if(!host)return;const plans=db.nutritionPlans||[];host.innerHTML=plans.length?plans.map(plan=>`<article class="nutrition-plan-row"><span class="nutrition-plan-icon">${plan.type==='application/pdf'?'▤':'▣'}</span><div><strong>${escapeHTML(plan.name)}</strong><small>${nutritionPlanFileLabel(plan)} · inserido em ${new Date(plan.addedAt+'T12:00').toLocaleDateString('pt-BR')}</small></div><div class="nutrition-plan-actions"><button class="outline" data-view-nutrition-plan="${plan.id}">Visualizar</button><button class="text-button danger-button" data-delete-nutrition-plan="${plan.id}">Excluir</button></div></article>`).join(''):'<p class="empty">Nenhum plano alimentar adicionado ainda.</p>';$$('[data-view-nutrition-plan]').forEach(button=>button.onclick=()=>openNutritionPlan(button.dataset.viewNutritionPlan));$$('[data-delete-nutrition-plan]').forEach(button=>button.onclick=()=>deleteNutritionPlan(button.dataset.deleteNutritionPlan))}
function fileToRawData(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)})}
async function importNutritionPlan(file){if(!(file.type==='application/pdf'||file.type.startsWith('image/'))){toast('Escolha um PDF ou uma imagem do plano alimentar.');return}try{const data=file.type.startsWith('image/')?await new Promise(resolve=>fileToData(file,resolve)):await fileToRawData(file),mediaId=await mfPutMedia(data),plan={id:mfMediaId(),name:file.name.replace(/\.[^/.]+$/,''),type:file.type,mediaId,addedAt:iso()};db.nutritionPlans=[plan,...(db.nutritionPlans||[])];save();toast('Plano alimentar salvo para consulta.') }catch{toast('Não foi possível guardar este plano neste aparelho.')}}
async function openNutritionPlan(id){const plan=(db.nutritionPlans||[]).find(item=>item.id===id);if(!plan)return;try{const data=await mfGetMedia(plan.mediaId);if(!data)throw new Error('Arquivo não encontrado');const preview=plan.type==='application/pdf'?`<iframe class="nutrition-plan-preview" src="${data}" title="Plano alimentar: ${escapeHTML(plan.name)}"></iframe>`:`<img class="nutrition-plan-image" src="${data}" alt="Plano alimentar: ${escapeHTML(plan.name)}">`;modal(`<div class="nutrition-plan-modal"><p class="eyebrow">PLANO PROFISSIONAL</p><h2>${escapeHTML(plan.name)}</h2><p class="hint">Arquivo mantido como foi recebido. Consulte as orientações da sua nutricionista antes de fazer alterações.</p>${preview}</div>`)}catch{toast('Não foi possível abrir esse plano neste aparelho.')}}
async function deleteNutritionPlan(id){const plan=(db.nutritionPlans||[]).find(item=>item.id===id);if(!plan||!confirm(`Excluir o plano “${plan.name}”?`))return;db.nutritionPlans=db.nutritionPlans.filter(item=>item.id!==id);try{await mfDeleteMedia(plan.mediaId)}catch{}save();toast('Plano alimentar excluído.')}
function showRecipe(i){const r=recipes[i],detail=recipeDetails[r[1]],video=recipeVideos[r[1]],ingredients=(detail?.ingredients||r[4].split(', ')).map(x=>`<li>${escapeHTML(x)}</li>`).join(''),steps=(detail?.steps||[r[5]]).map(x=>`<li>${escapeHTML(x)}</li>`).join(''),videoBlock=video?`<a class="primary recipe-video" target="_blank" rel="noopener" href="${video.url}">▶ Ver ${video.type==='Short'?'Short da receita':'vídeo da receita'}</a><p class="hint">${video.type==='Short'?'Vídeo curto escolhido para acompanhar sem perder tempo.':'Não encontrei um Short específico e escolhi um vídeo direto da receita.'}</p>`:`<p class="hint">Ainda não há um vídeo direto verificado para esta receita. Para evitar que você caia em buscas confusas, o app não abre uma lista genérica de vídeos.</p>`;modal(`<div class="recipe-modal"><div class="recipe-modal-icon">${r[0]}</div><p class="eyebrow">${escapeHTML(recipeMealPeriod.toUpperCase())} · ${r[3].toUpperCase()}</p><h2>${r[1]}</h2><p class="recipe-kcal">Estimativa por porção: <strong>${r[6]}</strong></p><h3>Ingredientes — 1 porção</h3><ul class="recipe-ingredients">${ingredients}</ul><h3>Passo a passo</h3><ol class="recipe-steps">${steps}</ol>${videoBlock}<button class="primary" id="addRecipeMeal">Registrar em ${escapeHTML(nutritionMealTypeForPeriod(recipeMealPeriod))}</button></div>`);$('#addRecipeMeal').onclick=e=>{e.preventDefault();db.meals.push({type:nutritionMealTypeForPeriod(recipeMealPeriod),food:r[1],calories:+r[6].replace(/\D/g,''),date:nutritionDate,time:nutritionNow()});$('#modal').close();save();toast('Receita adicionada ao diário no horário selecionado')}}
const sheetExerciseAliases=[['Cadeira extensora','Cadeira extensora'],['Supino vertical máquina','Supino na máquina'],['Supino vertical maquina','Supino na máquina'],['Supino na máquina','Supino na máquina'],['Puxada alta na polia','Puxada frontal'],['Puxada frontal','Puxada frontal'],['Remada baixa sentada','Remada baixa'],['Remada baixa','Remada baixa'],['Ponte pélvica','Elevação de quadril'],['Ponte pelvica','Elevação de quadril'],['Cadeira flexora','Mesa flexora'],['Mesa flexora','Mesa flexora'],['Elevação lateral','Elevação lateral'],['Elevacao lateral','Elevação lateral'],['Prancha isométrica','Prancha frontal'],['Prancha isometrica','Prancha frontal'],['Abdominal reto no solo','Abdominal reto no solo'],['Dead bug','Dead bug'],['Bird dog','Bird dog'],['Caminhada na esteira','Caminhada na esteira'],['Panturrilha em pé','Panturrilha em pé'],['Panturrilha em pe','Panturrilha em pé'],['Alongamento lombar','Alongamento lombar'],['Alongamento de pescoço','Alongamento de pescoço'],['Alongamento de pescoco','Alongamento de pescoço'],['Agachamento','Agachamento controlado'],['Leg press','Leg press'],['Afundo','Afundo alternado'],['Flexão','Flexão de braço'],['Flexao','Flexão de braço'],['Rosca','Rosca direta'],['Tríceps','Tríceps na polia'],['Triceps','Tríceps na polia'],['Levantamento terra','Levantamento terra romeno'],...exercises.map(exercise=>[exercise.name,exercise.name])];
function parseSheet(text=''){const source=String(text).replace(/\r/g,'').replace(/\s+/g,' ').trim(),esc=value=>normalizeText(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(!source)return[];const normal=normalizeText(source),found=[];sheetExerciseAliases.forEach(([alias,name])=>{const matcher=new RegExp(`\\b${esc(alias)}\\b`,'gi');let match;while((match=matcher.exec(normal))){found.push({start:match.index,end:matcher.lastIndex,name})}});const unique=[];found.sort((a,b)=>a.start-b.start||b.end-a.end).forEach(item=>{if(!unique.some(existing=>existing.start===item.start||item.start<existing.end&&item.end>existing.start))unique.push(item)});if(unique.length){return unique.slice(0,40).map((item,index)=>{const fragment=source.slice(item.start,unique[index+1]?.start||Math.min(source.length,item.end+90));const dose=fragment.match(/(?:séries?\s*)?(\d+)\s*(?:x|×|por)\s*(\d{1,3}(?:\s*(?:-|a|à)\s*\d{1,3})?)/i)||fragment.match(/\b([2-5])\s+(\d{1,3})\b/);return `${item.name}${dose?` · ${dose[1]}x${dose[2]}`:''}`}).filter((item,index,list)=>list.indexOf(item)===index)}return source.split(/\n+|[.;]/).map(line=>line.trim()).filter(line=>line.length>3&&/\d|flex|supino|agach|remada|puxada|rosca|tríceps|prancha|leg|elevação|terra|afundo/i.test(line)).slice(0,30)}
function sheetItemsForDisplay(sheet){const parsed=parseSheet(sheet.raw||''),saved=sheet.items||[];return parsed.length>saved.length?parsed:saved}
function normalizeText(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
const sheetEquivalenceRules=[{terms:['flex','supino','crucifixo','peito'],names:['Flexão de braço','Flexão inclinada','Supino com halteres','Supino na máquina']},{terms:['agach','leg press','extensora','extensao','afundo','quadricep'],names:['Agachamento controlado','Leg press','Afundo alternado','Agachamento com mini band','Isometria na parede']},{terms:['elevacao de quadril','ponte pelvica','ponte de gluteos'],names:['Elevação de quadril','Elevação pélvica com barra','Ponte de glúteos unilateral','Ponte de ombros (Pilates)','Ponte com mini band']},{terms:['remada','puxada','pulley','costas'],names:['Remada australiana','Remada baixa','Puxada frontal','Remada com elástico']},{terms:['rosca','biceps'],names:['Rosca direta','Rosca bíceps com elástico']},{terms:['triceps','mergulho'],names:['Tríceps na polia','Mergulho em banco','Tríceps acima da cabeça com elástico']},{terms:['ombro','desenvolvimento','elevacao lateral'],names:['Desenvolvimento com halteres','Elevação lateral','Rotação externa','Face pull com elástico']},{terms:['terra','stiff','posterior'],names:['Levantamento terra romeno','Mesa flexora','Elevação de quadril']},{terms:['prancha','core','abdominal'],names:['Respiração 360°','Dead bug','Bird dog','Prancha frontal']}];
function equivalentsFor(item,available=[]){const normalized=normalizeText(item);const rule=sheetEquivalenceRules.find(entry=>entry.terms.some(term=>normalized.includes(term)));let options=rule?exercises.filter(exercise=>rule.names.includes(exercise.name)):exercises.filter(exercise=>normalizeText(exercise.name).split(' ').some(word=>word.length>4&&normalized.includes(word)));if(available.length){const compatible=options.filter(exercise=>supportsEquipment(exercise.equip,available));if(compatible.length)options=compatible}return options.slice(0,6)}
function equivalentsMarkup(item,available=[]){const options=equivalentsFor(item,available);return options.length?`<div class="sheet-equivalents"><span class="hint">Alternativas:</span>${options.map(exercise=>`<a target="_blank" href="https://www.youtube.com/results?search_query=${exercise.youtube}">▶ ${escapeHTML(exercise.name)} · ${escapeHTML(exercise.equip)}</a>`).join('')}</div>`:'<p class="hint">Ainda não encontrei uma equivalência automática para este item. Use “Revisar ficha” para ajustar o texto.</p>'}
function renderSheets(){const list=$('#sheetList');if(!list)return;const sheets=db.sheets||[];list.innerHTML=sheets.length?sheets.map((sheet,index)=>{const items=sheetItemsForDisplay(sheet);return `<article class="panel sheet-row"><span class="big-icon">▤</span><div><p class="eyebrow">${sheet.reviewed?'FICHA REVISADA':'FICHA IMPORTADA'}</p><h2>${escapeHTML(sheet.name)}</h2><p>${items.length} exercícios identificados · importada em ${new Date(sheet.date).toLocaleDateString('pt-BR')}</p><div class="sheet-plan-preview">${items.slice(0,12).map((item,itemIndex)=>{const [name,dose]=item.split(' · ');return `<div class="sheet-plan-line"><span>${itemIndex+1}</span><strong>${escapeHTML(name)}</strong><small>${escapeHTML(dose||'Conforme ficha')}</small></div>`}).join('')||'<p class="empty">Não reconheci os exercícios. Use “Revisar ficha” para ajustar a leitura.</p>'}${items.length>12?`<small class="hint">+ ${items.length-12} exercício(s) na ficha</small>`:''}</div><div class="sheet-actions"><button class="primary" data-use-sheet="${index}">Usar minha ficha hoje</button><button class="outline" data-adapt-sheet="${index}">Gerar versão adaptada</button><button class="text-button" data-edit-sheet="${index}">Revisar ficha</button><button class="text-button danger-button" data-delete-sheet="${index}">Excluir ficha</button></div></div></article>`}).join(''):'<p class="empty">Nenhuma ficha importada ainda.</p>';$$('[data-use-sheet]').forEach(button=>button.onclick=()=>typeof window.mfUseSheetToday==='function'?window.mfUseSheetToday(+button.dataset.useSheet,false):startSheetWorkout(+button.dataset.useSheet,false));$$('[data-adapt-sheet]').forEach(button=>button.onclick=()=>typeof window.mfUseSheetToday==='function'?window.mfUseSheetToday(+button.dataset.adaptSheet,true):prepareSheetAdaptation(+button.dataset.adaptSheet));$$('[data-edit-sheet]').forEach(button=>button.onclick=()=>openSheetReview(+button.dataset.editSheet));$$('[data-delete-sheet]').forEach(button=>button.onclick=()=>deleteSheet(+button.dataset.deleteSheet))}
function openSheetReview(index){const sheet=(db.sheets||[])[index];if(!sheet)return;const items=sheetItemsForDisplay(sheet);modal(`<div class="sheet-review"><p class="eyebrow">REVISAR FICHA IMPORTADA</p><h2>${escapeHTML(sheet.name)}</h2><p class="hint">Corrija a leitura se necessário. A ficha já está salva e continuará disponível.</p><label>Conteúdo extraído<textarea id="sheetRawText" rows="10">${escapeHTML(sheet.raw||'')}</textarea></label><h3>Itens identificados</h3><div class="detected-items">${items.map(item=>`<span>${escapeHTML(item)}</span>`).join('')||'<span>Nenhum item reconhecido automaticamente — informe no campo acima.</span>'}</div><button class="primary" id="saveSheetReview">Salvar alterações</button></div>`);$('#saveSheetReview').onclick=event=>{event.preventDefault();const raw=$('#sheetRawText').value.trim();if(!raw)return;db.sheets[index]={...sheet,raw,items:parseSheet(raw),reviewed:true};$('#modal').close();save();toast('Ficha revisada e atualizada')}}
function deleteSheet(index){const sheet=(db.sheets||[])[index];if(!sheet)return;if(!confirm(`Excluir a ficha “${sheet.name}”? Esta ação remove apenas a ficha; os treinos já concluídos continuarão no seu histórico.`))return;db.sheets.splice(index,1);save();toast('Ficha excluída')}
function prepareSheetAdaptation(index){const sheet=(db.sheets||[])[index];if(!sheet)return;pendingSheetIndex=index;go('workout');$('#workoutSubtitle').textContent=`Ficha “${sheet.name}” selecionada. Faça o check-in para gerar equivalências e adaptações.`;$('#generateWorkout').textContent='Gerar versão adaptada da ficha →';$('#checkinBox').hidden=false;$('#workoutResult').hidden=true;$('#newCheckin').hidden=true}
function startSheetWorkout(index,adapted=false){const sheet=(db.sheets||[])[index];if(!sheet)return;pendingSheetIndex=null;const available=getTodayEquipment();const pain={};limitations.forEach(x=>pain[x]=+($(`#${painInputId(x)}`)?.value||0));const high=Object.entries(pain).filter(([,value])=>value>=6).map(([area])=>area);const sourceItems=sheet.items?.length?sheet.items:parseSheet(sheet.raw||'');const items=sourceItems.length?sourceItems:[sheet.raw||'Ficha sem itens reconhecidos'];go('workout');$('#checkinBox').hidden=true;$('#validatedSheets').hidden=true;$('#workoutResult').hidden=false;$('#newCheckin').hidden=false;$('#generateWorkout').textContent='Gerar meu treino adaptado →';$('#workoutSubtitle').textContent=`Usando a ficha “${sheet.name}”.`;$('#workoutResult').innerHTML=`<article class="workout-card"><div class="workout-top"><div><p class="eyebrow">${adapted?'VERSÃO ADAPTADA DA FICHA':'MINHA FICHA DE TREINO'}</p><h2>${escapeHTML(sheet.name)}</h2><p>${adapted?'Equivalências priorizadas pelos equipamentos e cuidados de hoje.':'Itens da ficha profissional, com alternativas do app abaixo.'}</p></div><div class="adaptation-note">${high.length?`Atenção para: ${high.join(', ')}.`:'Sem alerta de dor alta no check-in.'}</div></div><div class="workout-items">${items.map((item,index)=>{const safeOptions=equivalentsFor(item,adapted?available:[]).filter(exercise=>!high.some(area=>exerciseIsAffectedByPain(exercise,area)));const main=adapted?safeOptions[0]:null;const title=main?main.name:item;const detail=main?`${main.detail} · alternativa para: ${item}`:'Conforme ficha importada';return `<article class="workout-item"><span class="exercise-glyph">${main?.glyph||'▤'}</span><div class="workout-exercise"><h3>${index+1}. ${escapeHTML(title)}</h3><p>${escapeHTML(detail)}</p><small>${main?`Equipamento: ${escapeHTML(main.equip)}`:'Ficha importada'}</small>${equivalentsMarkup(item,adapted?available:[])}</div><a class="outline" target="_blank" href="https://www.youtube.com/results?search_query=${encodeURIComponent(main?.youtube||item)}">Demo</a></article>`}).join('')}</div><button class="primary" id="finishSheetWorkout">Concluir treino ✓</button></article>`;attachWorkoutTimer();$('#finishSheetWorkout').onclick=()=>{db.workouts.push({date:iso(),sheet:sheet.name,adapted,pain});save();toast('Treino da ficha concluído. Ótimo trabalho!')}}
function sheetSignature(value=''){return normalizeText(value).replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
function findDuplicateSheet(candidate){const candidateName=sheetSignature(candidate.name),candidateRaw=sheetSignature(candidate.raw);return (db.sheets||[]).find(sheet=>{const sameContent=candidateRaw.length>20&&sheetSignature(sheet.raw)===candidateRaw;const sameName=candidateName.length>2&&sheetSignature(sheet.name)===candidateName;return sameContent||sameName})}
function saveImportedSheet(sheet,status){db.sheets||(db.sheets=[]);db.sheets.unshift(sheet);save();status.textContent='Ficha importada e salva. Escolha abaixo se quer seguir a ficha ou gerar uma versão adaptada.';go('sheets');toast('Ficha importada com sucesso')}
function confirmDuplicateSheet(candidate,duplicate,status){status.textContent='Encontramos uma ficha parecida. Aguardando sua decisão.';modal(`<div class="sheet-review"><p class="eyebrow">POSSÍVEL FICHA REPETIDA</p><h2>Essa ficha já parece estar salva</h2><p>Ela é parecida com <strong>${escapeHTML(duplicate.name)}</strong>, importada em ${new Date(duplicate.date).toLocaleDateString('pt-BR')}. Nada foi salvo ainda.</p><p class="hint">Você pode cancelar e usar a ficha existente, ou manter esta segunda cópia se ela for uma versão diferente.</p><div class="sheet-actions"><button class="outline" type="button" id="cancelDuplicateSheet">Não inserir</button><button class="primary" type="button" id="keepDuplicateSheet">Inserir mesmo assim</button></div></div>`);$('#cancelDuplicateSheet').onclick=()=>{$('#modal').close();status.textContent='Importação cancelada: a ficha já existente foi mantida.';toast('Ficha repetida não foi inserida')};$('#keepDuplicateSheet').onclick=()=>{$('#modal').close();saveImportedSheet(candidate,status)}}
async function readSheetFile(file){const status=$('#sheetStatus');status.textContent='Lendo arquivo…';try{let text='';if(file.type==='application/pdf'){if(!window.pdfjsLib)throw new Error('Leitor de PDF indisponível');const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){const page=await pdf.getPage(pageNumber),content=await page.getTextContent();text+=content.items.map(item=>item.str).join(' ')+'\n'}if(!text.trim())throw new Error('Este PDF parece ser escaneado; envie uma foto nítida de cada página.')}else{if(!window.Tesseract)throw new Error('OCR indisponível sem conexão');const result=await Tesseract.recognize(file,'por',{logger:message=>{if(message.status==='recognizing text')status.textContent=`Lendo foto… ${Math.round(message.progress*100)}%`}});text=result.data.text}const raw=text.trim();if(!raw)throw new Error('Não foi encontrado texto');const candidate={name:file.name.replace(/\.[^/.]+$/,''),raw,items:parseSheet(raw),date:iso(),reviewed:false};const duplicate=findDuplicateSheet(candidate);if(duplicate){confirmDuplicateSheet(candidate,duplicate,status);return}saveImportedSheet(candidate,status)}catch(error){status.textContent=`Não foi possível ler automaticamente: ${error.message}. Você ainda pode tentar uma imagem mais nítida.`}}
function paintAvatar(element,profile){if(!element)return;element.textContent='';element.style.backgroundImage=profile.avatar?`url(${profile.avatar})`:"url('assets/marinafit-icon-512.png')"}
function renderProfile(){const p=db.profile;$('#profileName').textContent=p.name||'Marina';const profileBits=[p.age&&`${p.age} anos`,p.height&&`${p.height} cm`,p.goal].filter(Boolean);$('#profileInfo').textContent=profileBits.join(' · ')||'Complete seus dados para personalizar o app.';paintAvatar($('#avatar'),p);paintAvatar($('#brandAvatar'),p);let panel=$('#profileDataPanel');if(!panel){$('#avatar').closest('.profile-card').insertAdjacentHTML('afterend',`<article class="panel profile-data-panel" id="profileDataPanel"><p class="eyebrow">DADOS PESSOAIS</p><h2>Informações do seu perfil</h2><p class="hint">Esses dados preenchem automaticamente sua avaliação. O peso fica em Avaliação e Evolução, para manter um histórico por data.</p><form id="profileDataForm" class="profile-data-form"><label>Nome<input name="name" required /></label><label>Idade<input name="age" type="number" min="12" max="100" placeholder="Anos" /></label><label>Altura (cm)<input name="height" type="number" min="100" max="250" /></label><button class="primary profile-save" type="submit">Salvar dados do perfil</button></form></article>`);panel=$('#profileDataPanel')}const form=$('#profileDataForm');['name','age','height'].forEach(key=>form.elements[key].value=p[key]||'');form.onsubmit=event=>{event.preventDefault();const data=new FormData(form);Object.assign(db.profile,{name:data.get('name').trim(),age:data.get('age'),height:data.get('height')});save();renderAssessment();toast('Dados do perfil salvos e sincronizados com a avaliação.')}}
const mfBaseRenderProfile=renderProfile;
renderProfile=function(){mfBaseRenderProfile();if(!String(db.profile.name||'').trim())$('#profileName').textContent='Seu perfil'};
function modal(html){$('#modalContent').innerHTML=html;$('#modal').showModal()}
function addWeightModal(){modal(`<h2>Registrar peso</h2><div class="modal-fields"><label>Peso (kg)<input id="modalWeight" type="number" step="0.1" autofocus></label><label>Data<input id="modalWeightDate" type="date" value="${iso()}"></label><button class="primary" id="saveWeight">Salvar registro</button></div>`);$('#saveWeight').onclick=e=>{e.preventDefault();let v=$('#modalWeight').value;if(!v)return;db.weights.push({value:+v,date:$('#modalWeightDate').value});$('#modal').close();save();toast('Peso registrado')}}
function addMealModal(){modal(`<h2>Adicionar refeição</h2><div class="modal-fields"><label>Refeição<select id="mealType"><option>Café da manhã</option><option>Lanche da manhã</option><option>Almoço</option><option>Lanche da tarde</option><option>Jantar</option><option>Ceia</option></select></label><label>O que você comeu?<textarea id="mealFood" rows="3" placeholder="Ex.: arroz, feijão e frango"></textarea></label><label>Calorias (opcional)<input id="mealCalories" type="number" min="0"></label><label>Foto da refeição <input id="mealImage" type="file" accept="image/*" capture="environment"><small class="hint">Tire uma foto agora ou escolha uma existente.</small></label><button class="primary" id="saveMeal">Adicionar refeição</button></div>`);$('#saveMeal').onclick=e=>{e.preventDefault();if(!$('#mealFood').value.trim())return;const meal={type:$('#mealType').value,food:$('#mealFood').value.trim(),calories:+$('#mealCalories').value||0,date:iso()};fileToData($('#mealImage').files[0],data=>{meal.photo=data;db.meals.push(meal);$('#modal').close();save();toast('Refeição registrada')});if(!$('#mealImage').files[0]){db.meals.push(meal);$('#modal').close();save();toast('Refeição registrada')}}}
function fileToData(file,cb){if(!file)return;let r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(file)}
function initEvents(){
 $('#todayLabel').textContent=date();$('#appBack').classList.add('hidden');$('#appBack').onclick=()=>{if(viewHistory.length>1){viewHistory.pop();go(viewHistory.at(-1),true)}};$$('[data-view]').forEach(b=>b.onclick=()=>go(b.dataset.view));$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));$('#brandAvatar').onclick=()=>go('profile');$('#themeToggle').onclick=()=>setTheme(db.theme==='dark'?'light':'dark');$('#themeToggleMobile').onclick=()=>setTheme(db.theme==='dark'?'light':'dark');$('#profileTheme').onchange=e=>setTheme(e.target.checked?'dark':'light');$('#mobileMenu').onclick=()=>toast('Use a barra inferior para navegar.');
 $('#assessment').addEventListener('click',e=>{if(e.target.matches('[data-choice] button')){$$('[data-choice] button').forEach(b=>b.classList.remove('selected'));e.target.classList.add('selected');db.profile.goal=e.target.dataset.value}});$('#assessmentForm').onsubmit=e=>{e.preventDefault();let fd=new FormData(e.target);Object.assign(db.profile,Object.fromEntries(['name','age','height','weight','days','duration','notes','diastasisStatus'].map(k=>[k,fd.get(k)])));db.profile.diastasisFocus=fd.get('diastasisFocus')==='on';db.profile.equipment=[...$$('#equipmentChoices input:checked')].filter(x=>x.id!=='selectAllEquipment').map(x=>x.value);db.profile.limitations=[...$$('#limitationChoices input:checked')].map(x=>x.value);let testResults={};tests.forEach(test=>{const value=fd.get('test-'+test.key)||'',note=fd.get('test-note-'+test.key)||'',variation=fd.get('test-variation-'+test.key)||'';testResults[test.name]=test.type==='shoulder'?{resultado:value,detalhe:note}:{variação:variation,resultado:value?`${value} ${test.unit}`:''}});db.assessments.push({date:iso(),profile:structuredClone(db.profile),tests:testResults});if(db.profile.weight)db.weights.push({date:iso(),value:+db.profile.weight});save();toast('Avaliação salva para comparar em 4 semanas');go('dashboard')};$('#clearAssessment').onclick=()=>{if(confirm('Limpar os campos desta avaliação?')){$('#assessmentForm').reset();toast('Campos limpos')}};
 setEnergy(3);$$('#energyChoices [data-energy]').forEach(button=>button.onclick=()=>setEnergy(+button.dataset.energy));$('#todayEquipment').innerHTML=equipmentChoiceMarkup(db.profile.equipment||[],false,true);renderPainInputs();$('#generateWorkout').onclick=()=>{if(pendingSheetIndex!==null)startSheetWorkout(pendingSheetIndex,true);else{generateWorkout();attachWorkoutTimer()}};$('#newCheckin').onclick=()=>{pendingSheetIndex=null;$('#workoutSubtitle').textContent='Responda três passos simples e eu adapto o treino.';$('#generateWorkout').textContent='Gerar meu treino adaptado →';$('#checkinBox').hidden=false;$('#validatedSheets').hidden=false;$('#workoutResult').hidden=true;$('#newCheckin').hidden=true;renderWorkout()};
 $$('#exerciseFilters button').forEach(b=>b.onclick=()=>{$$('#exerciseFilters button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');renderExercises(b.dataset.filter)});$('#addWeight').onclick=addWeightModal;$('#weightHistoryToggle').onclick=()=>$('#weightHistory').hidden=!$('#weightHistory').hidden;$('#addPhoto').onclick=()=>$('#progressPhoto').click();$('#progressPhoto').onchange=e=>fileToData(e.target.files[0],data=>{db.photos.push({date:iso(),data});save();toast('Foto adicionada')});
 $('#addMeal').onclick=addMealModal;$('#addWater').onclick=()=>{db.water++;saveLocalOnly();renderNutrition();toast('Água registrada')};$('#mealPhotoButton').onclick=addMealModal;$('#importNutritionPlan').onclick=()=>$('#nutritionPlanInput').click();$('#nutritionPlanInput').onchange=event=>{const file=event.target.files[0];event.target.value='';if(file)importNutritionPlan(file)};$('#editAvatar').onclick=()=>$('#avatarInput').click();$('#avatarInput').onchange=e=>fileToData(e.target.files[0],data=>{db.profile.avatar=data;save();toast('Foto de perfil atualizada')});$('#importSheet').onclick=()=>$('#sheetFile').click();$('#sheetPicker').onclick=()=>$('#sheetFile').click();$('#sheetFile').onchange=e=>{const file=e.target.files[0];e.target.value='';if(file)readSheetFile(file)};$('#startDiastasis').onclick=startDiastasisRoutine;$('#resetDiastasis').onclick=()=>{if(diastasisTimerId)clearInterval(diastasisTimerId);diastasisTimerId=null;diastasisSequenceStep=null;diastasisSeconds=300;renderDiastasisRoutine();toast('Sequência pronta para recomeçar')};
 $('#exportBackup').onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db)],{type:'application/json'}));a.download=`marinafit-backup-${iso()}.json`;a.click();URL.revokeObjectURL(a.href);toast('Backup baixado')};$('#importBackup').onclick=()=>$('#importInput').click();$('#importInput').onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let data=JSON.parse(r.result);if(!data.profile)throw 0;db=data;save();toast('Backup restaurado com sucesso');go('dashboard')}catch{toast('Este arquivo não é um backup válido.')}};r.readAsText(f)};$('#wipeData').onclick=()=>{if(confirm('Apagar todos os dados deste aparelho? Esta ação não pode ser desfeita.')){db=structuredClone(initial);save();toast('Dados locais apagados')}};$('#printReport').onclick=()=>{let w=window.open('','_blank');w.document.write(`<title>Resumo MarinaFit Pro</title><h1>MarinaFit Pro — resumo de evolução</h1><p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p><h2>Perfil</h2><p>${db.profile.name||'—'} · ${db.profile.goal||'—'} · ${db.profile.weight||'—'} kg</p><h2>Progresso</h2><p>${db.workouts.length} treinos concluídos · ${db.assessments.length} avaliações</p><h2>Pesos</h2>${db.weights.map(x=>`<p>${x.date}: ${x.value} kg</p>`).join('')}`);w.print()};
}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=78');setTheme(db.theme);initEvents();initDiastasisGuideEvents();renderAll();

/* Mídias pesadas ficam no IndexedDB; o restante continua no localStorage. */
const MF_MEDIA_DB='marinafit-media-v1',MF_MEDIA_STORE='media';
let mfMediaDbPromise=null;
function mfOpenMediaDb(){
 if(mfMediaDbPromise)return mfMediaDbPromise;
 if(!('indexedDB'in window))return Promise.reject(new Error('IndexedDB indisponível'));
 mfMediaDbPromise=new Promise((resolve,reject)=>{const request=indexedDB.open(MF_MEDIA_DB,1);request.onupgradeneeded=()=>{const store=request.result.createObjectStore(MF_MEDIA_STORE,{keyPath:'id'});store.createIndex('createdAt','createdAt')};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
 return mfMediaDbPromise;
}
function mfMediaId(){return globalThis.crypto?.randomUUID?.()||`media-${Date.now()}-${Math.random().toString(16).slice(2)}`}
async function mfPutMedia(data,id=mfMediaId()){const database=await mfOpenMediaDb();const record={id,data,createdAt:new Date().toISOString()};await new Promise((resolve,reject)=>{const request=database.transaction(MF_MEDIA_STORE,'readwrite').objectStore(MF_MEDIA_STORE).put(record);request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error)});return id}
async function mfGetMedia(id){if(!id)return'';const database=await mfOpenMediaDb();return new Promise((resolve,reject)=>{const request=database.transaction(MF_MEDIA_STORE,'readonly').objectStore(MF_MEDIA_STORE).get(id);request.onsuccess=()=>resolve(request.result?.data||'');request.onerror=()=>reject(request.error)})}
async function mfDeleteMedia(id){if(!id)return;const database=await mfOpenMediaDb();await new Promise((resolve,reject)=>{const request=database.transaction(MF_MEDIA_STORE,'readwrite').objectStore(MF_MEDIA_STORE).delete(id);request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error)})}
async function mfAllMedia(){const database=await mfOpenMediaDb();return new Promise((resolve,reject)=>{const request=database.transaction(MF_MEDIA_STORE,'readonly').objectStore(MF_MEDIA_STORE).getAll();request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error)})}
async function mfImportMedia(records=[]){if(!records.length)return;const database=await mfOpenMediaDb();await new Promise((resolve,reject)=>{const transaction=database.transaction(MF_MEDIA_STORE,'readwrite'),store=transaction.objectStore(MF_MEDIA_STORE);records.forEach(record=>store.put(record));transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error)})}
async function mfClearMedia(){try{const database=await mfOpenMediaDb();await new Promise((resolve,reject)=>{const request=database.transaction(MF_MEDIA_STORE,'readwrite').objectStore(MF_MEDIA_STORE).clear();request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error)})}catch{}}
function mfPersistLocal(){try{localStorage.setItem(DBKEY,JSON.stringify(db));return true}catch(error){console.error(error);toast('O armazenamento local ficou cheio. Exporte um backup e remova fotos antigas.');return false}}
function save(){if(mfPersistLocal())renderAll()}
function saveLocalOnly(){mfPersistLocal()}
function fileToData(file,cb){
 if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{const image=new Image();image.onload=()=>{const maxWidth=800,scale=Math.min(1,maxWidth/image.naturalWidth),width=Math.max(1,Math.round(image.naturalWidth*scale)),height=Math.max(1,Math.round(image.naturalHeight*scale)),canvas=document.createElement('canvas'),context=canvas.getContext('2d');canvas.width=width;canvas.height=height;context.fillStyle='#ffffff';context.fillRect(0,0,width,height);context.drawImage(image,0,0,width,height);cb(canvas.toDataURL('image/jpeg',.6))};image.onerror=()=>cb(reader.result);image.src=reader.result};
 reader.readAsDataURL(file);
}
async function mfMigrateLegacyMedia(){
 let changed=false;
 for(const photo of db.photos||[]){if(photo.data&&!photo.mediaId){try{photo.mediaId=await mfPutMedia(photo.data);delete photo.data;changed=true}catch{}}}
 for(const meal of db.meals||[]){if(meal.photo&&!meal.photoMediaId){try{meal.photoMediaId=await mfPutMedia(meal.photo);delete meal.photo;changed=true}catch{}}}
 if(changed)saveLocalOnly();
 renderProgress();
}
async function mfHydrateProgressPhotos(){
 const photos=$$('#photoGrid img[data-mf-media-id]');
 await Promise.all(photos.map(async image=>{try{const data=await mfGetMedia(image.dataset.mfMediaId);if(data)image.src=data}catch{}}));
}
function renderProgress(){
 const w=db.weights.at(-1)?.value||db.profile.weight;
 $('#progressWeight').textContent=w?`${w} kg`:'—';$('#assessmentCount').textContent=db.assessments.length;$('#progressWorkouts').textContent=db.workouts.length;
 const values=db.weights.slice(-8);
 if(values.length<2)$('#weightChart').innerHTML='<p>Registre ao menos dois pesos para ver seu gráfico.</p>';
 else{const min=Math.min(...values.map(item=>+item.value)),max=Math.max(...values.map(item=>+item.value));$('#weightChart').innerHTML=values.map(item=>{const height=max===min?55:25+75*((item.value-min)/(max-min));return `<div class="bar-wrap"><div class="bar" style="height:${height}%" title="${item.value} kg"></div><small>${new Date(item.date+'T12:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</small></div>`}).join('')}
 $('#weightHistory').innerHTML=[...db.weights].reverse().map(item=>`<div class="history-row"><span>${new Date(item.date+'T12:00').toLocaleDateString('pt-BR')}</span><strong>${item.value} kg</strong></div>`).join('');
 $('#photoGrid').innerHTML=(db.photos||[]).map(photo=>`<img ${photo.data?`src="${photo.data}"`:'src=""'} ${photo.mediaId?`data-mf-media-id="${photo.mediaId}"`:''} alt="Foto de evolução de ${photo.date}">`).join('')||'<p class="hint">Você ainda não adicionou fotos.</p>';
 mfHydrateProgressPhotos();
}
function addMealModal(preselectedType=''){
 const types=['Café da manhã','Lanche da manhã','Almoço','Lanche da tarde','Jantar','Ceia'],selected=types.includes(preselectedType)?preselectedType:'',options=types.map(type=>`<option ${type===selected?'selected':''}>${type}</option>`).join('');
 modal(`<h2>Adicionar refeição</h2><p class="hint">O horário vem preenchido com o momento do registro, mas você pode ajustá-lo se estiver registrando uma refeição anterior.</p><div class="modal-fields"><label>Refeição<select id="mealType">${options}</select></label><div class="field-grid"><label>Data<input id="mealDate" type="date" value="${nutritionDate}"></label><label>Horário<input id="mealTime" type="time" value="${nutritionNow()}"></label></div><label>O que você comeu?<textarea id="mealFood" rows="3" placeholder="Ex.: arroz, feijão e frango"></textarea></label><label>Calorias (opcional)<input id="mealCalories" type="number" min="0"></label><label>Foto da refeição <input id="mealImage" type="file" accept="image/*" capture="environment"><small class="hint">A foto é comprimida e guardada localmente neste aparelho.</small></label><button class="primary" id="saveMeal">Adicionar refeição</button></div>`);
 $('#saveMeal').onclick=event=>{event.preventDefault();if(!$('#mealFood').value.trim())return;const meal={type:$('#mealType').value,food:$('#mealFood').value.trim(),calories:+$('#mealCalories').value||0,date:$('#mealDate').value||nutritionDate,time:$('#mealTime').value||nutritionNow()},file=$('#mealImage').files[0];const finish=async data=>{if(data){try{meal.photoMediaId=await mfPutMedia(data)}catch{meal.photo=data}}db.meals.push(meal);nutritionDate=meal.date;$('#modal').close();save();toast(`Refeição registrada às ${meal.time}`)};if(file)fileToData(file,finish);else finish()};
}
function sanitizeSheetText(value=''){
 return String(value).replace(/\r/g,'\n').replace(/\u00a0/g,' ').replace(/[×X]/g,'x')
  .replace(/(\d)\s*[oO]\s*(?=\d)/g,(_,digit)=>`${digit}0`)
  .replace(/\b[oO](?=\d)/g,'0')
  .replace(/\b(\d{1,2})\s*(?:s[eé]ries?|serie)\s*(?:de\s*)?(\d{1,3})\b/gi,'$1x$2')
  .replace(/(\d{1,2})\s*[x*]\s*([\doO]{1,3})/g,(_,sets,reps)=>`${sets}x${String(reps).replace(/[oO]/g,'0')}`)
  .replace(/(\d{1,3})\s*(?:reps?|repeti[cç][oõ]es?)\b/gi,'$1 repetições')
  .replace(/[|;]/g,'\n').replace(/[ \t]+\n/g,'\n').replace(/\n[ \t]+/g,'\n').replace(/[ \t]{2,}/g,' ').trim();
}
function parseSheet(text=''){const source=sanitizeSheetText(text).replace(/\s+/g,' ').trim(),esc=value=>normalizeText(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(!source)return[];const normal=normalizeText(source),found=[];sheetExerciseAliases.forEach(([alias,name])=>{const matcher=new RegExp(`\\b${esc(alias)}\\b`,'gi');let match;while((match=matcher.exec(normal)))found.push({start:match.index,end:matcher.lastIndex,name})});const unique=[];found.sort((left,right)=>left.start-right.start||right.end-left.end).forEach(item=>{if(!unique.some(existing=>existing.start===item.start||item.start<existing.end&&item.end>existing.start))unique.push(item)});if(unique.length)return unique.slice(0,40).map((item,index)=>{const fragment=source.slice(item.start,unique[index+1]?.start||Math.min(source.length,item.end+90));const dose=fragment.match(/(?:séries?\s*)?(\d+)\s*(?:x|por)\s*(\d{1,3}(?:\s*(?:-|a|à)\s*\d{1,3})?)/i)||fragment.match(/\b([2-5])\s+(\d{1,3})\b/);return `${item.name}${dose?` · ${dose[1]}x${dose[2]}`:''}`}).filter((item,index,list)=>list.indexOf(item)===index);return source.split(/\n+|[.;]/).map(line=>line.trim()).filter(line=>line.length>3&&/\d|flex|supino|agach|remada|puxada|rosca|tríceps|prancha|leg|elevação|terra|afundo/i.test(line)).slice(0,30)}
async function readSheetFile(file){
 const status=$('#sheetStatus');status.textContent='Lendo arquivo…';
 try{let text='';if(file.type==='application/pdf'){if(!window.pdfjsLib)throw new Error('Leitor de PDF indisponível');const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){const page=await pdf.getPage(pageNumber),content=await page.getTextContent();text+=mfPdfTextByLine(content)+'\n'}if(!text.trim())throw new Error('Este PDF parece ser escaneado; envie uma foto nítida de cada página.')}else{if(!window.Tesseract)throw new Error('OCR indisponível sem conexão');const result=await Tesseract.recognize(file,'por',{logger:message=>{if(message.status==='recognizing text')status.textContent=`Lendo foto… ${Math.round(message.progress*100)}%`}});text=result.data.text}const raw=sanitizeSheetText(text);if(!raw)throw new Error('Não foi encontrado texto');const candidate={name:file.name.replace(/\.[^/.]+$/,''),raw,items:parseSheet(raw),date:iso(),reviewed:false},duplicate=findDuplicateSheet(candidate);if(duplicate){confirmDuplicateSheet(candidate,duplicate,status);return}saveImportedSheet(candidate,status)}catch(error){status.textContent=`Não foi possível ler automaticamente: ${error.message}. Você ainda pode tentar uma imagem mais nítida.`}
}
function mfPdfTextByLine(content){
 const rows=[];
 (content.items||[]).forEach(item=>{
  const value=String(item.str||'').trim();if(!value)return;
  const x=Number(item.transform?.[4]||0),y=Number(item.transform?.[5]||0);
  let row=rows.find(entry=>Math.abs(entry.y-y)<2.5);
  if(!row){row={y,parts:[]};rows.push(row)}
  row.parts.push({x,value});
 });
 return rows.sort((a,b)=>b.y-a.y).map(row=>row.parts.sort((a,b)=>a.x-b.x).map(part=>part.value).join(' ').replace(/\s{2,}/g,' ').trim()).filter(Boolean).join('\n');
}
function mfSheetPrescription(value=''){
 const source=String(value).replace(/\s+/g,' ').trim();
 const match=source.match(/(?:\s*[·|]\s*)?(\d+)\s*[x×]\s*(\d+(?:\s*(?:-|a|à)\s*\d+)?(?:\s*(?:reps?|repetições|segundos|s|por lado|ciclos))?(?:\s*\([^)]*\))?)\s*$/i);
 if(!match)return {name:source,dose:'Conforme ficha'};
 return {name:source.slice(0,match.index).replace(/[·|\-–—\s]+$/,'').trim()||source,dose:`${match[1]} x ${match[2]}`};
}
function mfSheetDocumentSections(sheet){
 const source=String(sheet.raw||'').replace(/\r/g,'\n').replace(/\s+(?=TREINO\s+[A-Z0-9]+\s*:)/gi,'\n').replace(/\s+(?=\d+[.)]\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g,'\n');
 const lines=source.split(/\n+/).map(line=>line.replace(/\s{2,}/g,' ').trim()).filter(Boolean);
 const sections=[];let current=null;
 const ensure=()=>{if(!current){current={title:'TREINO IMPORTADO',rows:[]};sections.push(current)}return current};
 lines.forEach(line=>{
  const heading=line.match(/^(?:TREINO|DIA|ROTINA)\s*([A-Z0-9]+)?\s*[:\-|]\s*(.*)$/i);
  if(heading){current={title:`${heading[0].replace(/\s+/g,' ').trim()}`,rows:[]};sections.push(current);return}
  const exercise=line.match(/^(\d{1,2})[.)]\s*(.+)$/);
  if(exercise){ensure().rows.push({number:exercise[1],name:exercise[2],dose:'',note:''});return}
  if(!current?.rows.length)return;
  const row=current.rows.at(-1);
  if(/^\*?\s*(?:nota|obs(?:ervação)?)/i.test(line)){row.note=line.replace(/^\*?\s*(?:nota|obs(?:ervação)?)\s*:?\s*/i,'');return}
  if(/^\d+\s*[x×]/i.test(line)){row.dose=line;return}
  if(!/^[=\-_]{3,}$/.test(line))row.note=[row.note,line].filter(Boolean).join(' ');
 });
 const recognized=sections.filter(section=>section.rows.length);
 if(recognized.length)return recognized.map(section=>({...section,rows:section.rows.map(row=>{const parsed=mfSheetPrescription(row.name);return {...row,name:parsed.name,dose:row.dose||parsed.dose}})}));
 const items=sheetItemsForDisplay(sheet);
 return [{title:'TREINO IMPORTADO',rows:items.map((item,index)=>{const parsed=mfSheetPrescription(item);return {number:index+1,name:parsed.name,dose:parsed.dose,note:''}})}];
}
function mfSheetHeaderObservation(sheet){
 const source=String(sheet.raw||'').replace(/\r/g,'\n');
 const header=source.split(/\n\s*(?:TREINO|DIA|ROTINA)\s+[A-Z0-9]+\s*[:\-|]/i)[0]||'';
 const lines=header.split(/\n+/).map(line=>line.trim()).filter(Boolean);
 const noteIndex=lines.findIndex(line=>/^\*?\s*(?:obs|nota)/i.test(line));
 return noteIndex<0?'':lines.slice(noteIndex,noteIndex+2).join(' ').replace(/^\*?\s*(?:obs(?:ervação)?|nota)\s*:?\s*/i,'');
}
function mfSheetValidity(sheet){
 const active=db.training?.activeSheet,key=`${sheet.date}|${sheet.name}`;
 if(active?.key===key)return `VÁLIDA DE ${new Date(active.startDate+'T12:00').toLocaleDateString('pt-BR')} ATÉ ${new Date(active.validUntil+'T12:00').toLocaleDateString('pt-BR')}`;
 return 'VALIDADE: DEFINIR AO ATIVAR O PLANO';
}
function mfSheetDocumentMarkup(sheet,index){
 const sections=mfSheetDocumentSections(sheet),items=sections.flatMap(section=>section.rows),observation=mfSheetHeaderObservation(sheet);
 return `<article class="panel sheet-row mf-sheet-row"><section class="mf-sheet-document" aria-label="Ficha de treino ${escapeHTML(sheet.name)}"><div class="mf-sheet-brand">======= MARINAFIT PRO =======</div><h2>FICHA DE TREINO - ${escapeHTML(sheet.name)}</h2><p class="mf-sheet-meta">${mfSheetValidity(sheet)} · ${items.length} EXERCÍCIOS · IMPORTADA EM ${new Date(sheet.date+'T12:00').toLocaleDateString('pt-BR')}</p><div class="mf-sheet-rule"></div>${observation?`<p class="mf-sheet-observation"><b>OBS.:</b> ${escapeHTML(observation)}</p><div class="mf-sheet-rule"></div>`:''}${sections.map(section=>`<section class="mf-sheet-session"><h3>${escapeHTML(section.title)}</h3><div class="mf-sheet-rule"></div><ol class="mf-sheet-lines">${section.rows.map((row,rowIndex)=>`<li><span class="mf-sheet-number">${String(row.number||rowIndex+1).padStart(2,'0')}</span><div><strong>${escapeHTML(row.name)}</strong>${row.note?`<small>*Nota: ${escapeHTML(row.note)}</small>`:''}</div><span class="mf-sheet-dose">${escapeHTML(row.dose||'Conforme ficha')}</span></li>`).join('')}</ol></section>`).join('')}<div class="mf-sheet-rule"></div><p class="mf-sheet-footer">BONS TREINOS! USE ESTA FICHA NO APP.</p></section><div class="sheet-actions mf-sheet-actions"><button class="primary" data-use-sheet="${index}">Usar minha ficha hoje</button><button class="outline" data-adapt-sheet="${index}">Gerar versão adaptada</button><button class="text-button" data-edit-sheet="${index}">Revisar ficha</button><button class="text-button danger-button" data-delete-sheet="${index}">Excluir ficha</button></div></article>`;
}
function renderSheets(){
 const list=$('#sheetList');if(!list)return;const sheets=db.sheets||[];
 list.innerHTML=sheets.length?sheets.map(mfSheetDocumentMarkup).join(''):'<p class="empty">Nenhuma ficha importada ainda.</p>';
 $$('[data-use-sheet]').forEach(button=>button.onclick=()=>typeof window.mfUseSheetToday==='function'?window.mfUseSheetToday(+button.dataset.useSheet,false):startSheetWorkout(+button.dataset.useSheet,false));
 $$('[data-adapt-sheet]').forEach(button=>button.onclick=()=>typeof window.mfUseSheetToday==='function'?window.mfUseSheetToday(+button.dataset.adaptSheet,true):prepareSheetAdaptation(+button.dataset.adaptSheet));
 $$('[data-edit-sheet]').forEach(button=>button.onclick=()=>openSheetReview(+button.dataset.editSheet));
 $$('[data-delete-sheet]').forEach(button=>button.onclick=()=>deleteSheet(+button.dataset.deleteSheet));
}
function initMediaFeatures(){
 $('#progressPhoto').onchange=event=>fileToData(event.target.files[0],async data=>{try{db.photos.push({date:iso(),mediaId:await mfPutMedia(data)})}catch{db.photos.push({date:iso(),data})}save();toast('Foto adicionada')});
 $('#exportBackup').onclick=async()=>{try{const backup=structuredClone(db);backup.marinafitMedia=await mfAllMedia();const anchor=document.createElement('a');anchor.href=URL.createObjectURL(new Blob([JSON.stringify(backup)],{type:'application/json'}));anchor.download=`marinafit-backup-${iso()}.json`;anchor.click();URL.revokeObjectURL(anchor.href);toast('Backup baixado, incluindo as fotos.')}catch{toast('Não foi possível preparar o backup com as fotos.')}};
 $('#importBackup').onclick=()=>$('#importInput').click();
 $('#importInput').onchange=event=>{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=async()=>{try{const restored=JSON.parse(reader.result);if(!restored.profile)throw new Error('Backup inválido');const media=restored.marinafitMedia||[];delete restored.marinafitMedia;db=restored;await mfImportMedia(media);await mfMigrateLegacyMedia();save();toast('Backup restaurado com sucesso');go('dashboard')}catch{toast('Este arquivo não é um backup válido.')}};reader.readAsText(file)};
 $('#wipeData').onclick=async()=>{if(confirm('Apagar todos os dados deste aparelho? Esta ação não pode ser desfeita.')){db=structuredClone(initial);await mfClearMedia();save();toast('Dados locais apagados')}};
}
initMediaFeatures();
mfMigrateLegacyMedia();
