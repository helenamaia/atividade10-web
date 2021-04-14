const urlBase = 'https://opentdb.com';
const proxy = 'https://cors-anywhere.herokuapp.com/';
let categorias; 
let perguntas; 
let vetor = [];
const elementos = {
    categoriaSelect: document.querySelector('#categoria-pergunta'), 
    telaInicial: document.querySelector('.pagina-opcoes'),
    telaJogo: document.querySelector('.jogo'),
    jogar: document.querySelector('.botao-jogar'), 
    dificulty: document.querySelector('#dificuldade-pergunta'),
    category: document.querySelector('#categoria-pergunta'),
    divPergunta: document.querySelector('.pergunta'),
    divRespostas: document.querySelector('.radio-respostas'),
    proximaPergunta: document.querySelector('.next-pergunta'),
    guardaPergunta: document.querySelector('.save-pergunta'),
    respondePergunta: document.querySelector('.return-pergunta'),
    submetePergunta: document.querySelector('.check-pergunta'),
};

const pegarCategorias = () => {
   
    axios.get(`${urlBase}/api_category.php`)
      .then(response => {
          const aux = response.data.trivia_categories;
          const aux1 = JSON.stringify(aux);
          categorias = JSON.parse(aux1);
          console.log(categorias);
          for (let i = 0; i < categorias.length; i++) {
              colocarCategorias(categorias[i].name);
              if(i===(parseInt(categorias.length)-1)){
                elementos.categoriaSelect.innerHTML += `<option value="" selected>Selecione uma Categoria</option>`;  
              }
          }
    });
};

//https://opentdb.com/api.php?amount=10&category=19&difficulty=easy
//https://opentdb.com/api.php?amount=1&category=21&difficulty=hard

const pegarPerguntas = (dificul, categor) => {
    axios.get(`${urlBase}/api.php?amount=10&category=${categor.id}&difficulty=${dificul}`)
      .then(response => {
          
          const auxP = response.data.results;
          const aux1P = JSON.stringify(auxP);
          perguntas = JSON.parse(aux1P);
          console.log(perguntas);
          colocarPerguntaAleatoria();
          elementos.proximaPergunta.addEventListener('click', () => colocarPerguntaAleatoria());
          elementos.guardaPergunta.addEventListener('click', () => guardarPergunta());

    });
}


  const colocarCategorias = (categoria) =>{
    elementos.categoriaSelect.innerHTML += `<option value="${categoria}" selected>${categoria}</option>`;
  }

  const novoJogo = () =>{
    pegarCategorias();

    jogo = {
        perguntaGuardada: {
            categoria: undefined,
            tipo: undefined,
            dificuldade: undefined,
            questao: undefined,
            respostaCorreta: undefined,
            respostasIncorretas : [],
        }, 
        dificuldade: undefined, 
        acertos:undefined, 
        erros:undefined,

    }

    elementos.telaInicial.style.display = 'flex';
    elementos.telaJogo.style.display = 'none'; 

    elementos.jogar.addEventListener('click', () => gerarListaPerguntas());
    

  }

  const guardarPergunta = () => {


    colocarPerguntaAleatoria();
  }

  const gerarListaPerguntas = () =>{
    elementos.telaInicial.style.display = 'none';
    elementos.telaJogo.style.display = 'flex';

    
    const selectedIndexD = elementos.dificulty.selectedIndex;
    const dificul = elementos.dificulty.options[selectedIndexD].value;
    
    const selectedIndexC = elementos.category.selectedIndex;
    let categor = elementos.category.options[selectedIndexC].value;

    if(categor== ''){
        categor = sortearCategoriaAleatoria();
        
        
    }else{
        for (let i = 0; i < categorias.length; i++) {
            if(categor == categorias[i].name){
                categor = categorias[i];
               
            }
        }
    }
    
    pegarPerguntas(dificul, categor);
    
  }

  const colocarPerguntaAleatoria = () => {
    
    
    let vddFal=false;
    const i = Math.floor(Math.random() * perguntas.length);
    const p = perguntas[i];     
    for (let j = 0; j < vetor.length; j++) {
      if(i==vetor[j]){
        vddFal = true;
      } 
    }

    if(vetor.length<10){
      if(vddFal == true){
        colocarPerguntaAleatoria();
      }else if(vddFal == false){
          vetor.push(i);
          elementos.divPergunta.innerHTML = `<div>${perguntas[i].question}</div>`
          elementos.divRespostas.innerHTML = ' ';
          let possibilidades = perguntas[i].incorrect_answers;
          possibilidades.push(perguntas[i].correct_answer);
          possibilidades =  possibilidades.sort(() => Math.random() - 0.5)
          
          for (let j = 0; j < possibilidades.length; j++) {
            elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas" value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
          }

          elementos.proximaPergunta.addEventListener('click', () => colocarPerguntaAleatoria());
          elementos.guardarPergunta.addEventListener('click', () => guardarPergunta()); 
          elementos.respondePergunta.addEventListener('click', () => responderPerguntaGuardada());
          elementos.submetePergunta.addEventListener('click', () => checarPergunta());         

          
      }
    }else if(vetor.length==10){
      console.log('cabou');
    }
    

    
  }

  const responderPerguntaGuardada = () =>{

  }

  const checarPergunta = () =>{
    
  }
  


  const sortearCategoriaAleatoria = () => {
      const i = Math.floor(Math.random() * categorias.length);
      const c = categorias[i];     
      return c; 
  }




  novoJogo();
