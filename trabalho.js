const urlBase = 'https://opentdb.com';
const proxy = 'https://cors-anywhere.herokuapp.com/';
let categorias; 
let perguntas; 
let id;
let possibilidades;
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
    guardaPergunta: document.querySelector('.save-pergunta'),
    retornaPergunta: document.querySelector('.return-pergunta'),
    submetePergunta: document.querySelector('.check-pergunta'),
    proximaPergunta: document.querySelector('.next-pergunta'),
    divPontuacao: document.querySelector('.pontuacao'),
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

const pegarPerguntas = () => {
    axios.get(`${urlBase}/api.php?amount=10&category=${jogo.categoria.id}&difficulty=${jogo.dificuldade}`)
      .then(response => {
          
          const auxP = response.data.results;
          const aux1P = JSON.stringify(auxP);
          perguntas = JSON.parse(aux1P);
          console.log(perguntas);
          colocarPerguntaAleatoria();
          elementos.submetePergunta.addEventListener('click', () => respondePergunta());
          elementos.guardaPergunta.addEventListener('click', () => guardarPergunta());

    });
}

const respondePergunta = () =>{
  const  radiobutton = document.querySelector('input[name="respostas"]:checked').value;
  
    elementos.divRespostas.innerHTML = '';
    for (let j = 0; j < possibilidades.length; j++) {
      if(possibilidades[j]==perguntas[id].correct_answer && perguntas[id].correct_answer == radiobutton){
        elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-success text-white"><input  type="radio" name="respostas"  value="${possibilidades[j]}" checked/>${possibilidades[j]}<br/></div>`
      }else if(possibilidades[j]==perguntas[id].correct_answer  && perguntas[id].correct_answer != radiobutton ){
        elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-success text-white"><input  type="radio" name="respostas"  value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
      }else if(possibilidades[j]!=perguntas[id].correct_answer  && possibilidades[j] == radiobutton ){
        elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-danger text-white"><input  type="radio" name="respostas"  value="${possibilidades[j]}" checked/>${possibilidades[j]}<br/></div>`
      }else{
        elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-danger text-white"><input type="radio" name="respostas"  value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
      }
      
    }

    console.log(jogo.pontuacao);
    elementos.submetePergunta.style.display = 'none';
    elementos.proximaPergunta.style.display = 'flex';

    const pontos = calculaPontuacao(radiobutton);

    
    console.log(jogo.pontuacao);
    elementos.divPontuacao.innerHTML = `<div class="p-3 mb-2 bg-light text-dark"><strong>Pontuação computada:${pontos} Pontuação total: ${jogo.pontuacao}<strong></div>`



    elementos.proximaPergunta.addEventListener('click', () => colocarPerguntaAleatoria());
  
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
        categoria: {
          id: undefined,
          name: undefined,
        },
        acertos:undefined, 
        erros:undefined,
        pontuacao:0,

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
    
    jogo.dificuldade = dificul;
    jogo.categoria = categor;

    pegarPerguntas();
    
  }

  const calculaPontuacao = (radiobutton) => {
    let valor;
      if(radiobutton == perguntas[id].correct_answer && jogo.dificuldade == 'easy'){
         jogo.pontuacao += 5;
         valor = 5;
         jogo.acertos++;
      }else if(radiobutton == perguntas[id].correct_answer && jogo.dificuldade == 'medium'){
         jogo.pontuacao += 8;
         valor = 8;
         jogo.acertos++;
      }else if(radiobutton == perguntas[id].correct_answer && jogo.dificuldade == 'hard'){
        jogo.pontuacao += 10;
        valor = 10;
        jogo.acertos++;
      }else if(radiobutton != perguntas[id].correct_answer && jogo.dificuldade == 'easy'){
        jogo.pontuacao -= 5;
        valor = -5;
        jogo.erros++;
      }else if(radiobutton != perguntas[id].correct_answer && jogo.dificuldade == 'medium'){
        jogo.pontuacao -= 8;
        valor = -8;
        jogo.erros++;
      }else if(radiobutton != perguntas[id].correct_answer && jogo.dificuldade == 'hard'){
        jogo.pontuacao -= 10;
        valor = -10;
        jogo.erros++;
      }


    return valor;  
  }

  const colocarPerguntaAleatoria = () => {
    elementos.retornaPergunta.style.display = 'none';
    elementos.proximaPergunta.style.display = 'none';
    elementos.submetePergunta.style.display = 'flex';
    

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
          id = i;
          elementos.divPergunta.innerHTML = `<div>${perguntas[i].question}</div>`
          elementos.divRespostas.innerHTML = ' ';
          possibilidades = perguntas[i].incorrect_answers;
          possibilidades.push(perguntas[i].correct_answer);
          possibilidades =  possibilidades.sort(() => Math.random() - 0.5)
          
          for (let j = 0; j < possibilidades.length; j++) {
            if(j==0){
              elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas"  value="${possibilidades[j]}" checked/>${possibilidades[j]}<br/></div>`
            }else{
              elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas"  value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
            }
            
          }

          //elementos.guardarPergunta.addEventListener('click', () => guardarPergunta());
          //elementos.submetePergunta.addEventListener('click', () => checarPergunta());         

          
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
