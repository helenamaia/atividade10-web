const urlBase = 'https://opentdb.com';
const proxy = 'https://cors-anywhere.herokuapp.com/';
let categorias; 
let perguntas; 
let possibilidades;
const elementos = {
    categoriaSelect: document.querySelector('#categoria-pergunta'), 
    telaInicial: document.querySelector('.pagina-opcoes'),
    telaJogo: document.querySelector('.jogo'),
    telaFinal: document.querySelector('.finalizacao'),
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
    divMensagemFinal: document.querySelector('.mensagemFinal'),
    divDados: document.querySelector('.dados'),
};

const pegarCategorias = () => {
   
    axios.get(`${urlBase}/api_category.php`)
      .then(response => {
          const aux = response.data.trivia_categories;
          const aux1 = JSON.stringify(aux);
          categorias = JSON.parse(aux1);
          
          for (let i = 0; i < categorias.length; i++) {
              colocarCategorias(categorias[i].name);
              if(i===(parseInt(categorias.length)-1)){
                elementos.categoriaSelect.innerHTML += `<option value="" selected>Selecione uma Categoria</option>`;  
              }
          }
    });
};


const pegarPerguntas = () => {
    axios.get(`${urlBase}/api.php?amount=1&category=${jogo.categoria.id}&difficulty=${jogo.dificuldade}`)
      .then(response => {
          
          const auxP = response.data.results;
          const aux1P = JSON.stringify(auxP);
          perguntas = JSON.parse(aux1P);
          colocarPerguntaAleatoria();
          
    });
}

  const sortearCategoriaAleatoria = () => {
      const i = Math.floor(Math.random() * categorias.length);
      const c = categorias[i];     
      return c; 
  }

 

  const colocarCategorias = (categoria) =>{
    elementos.categoriaSelect.innerHTML += `<option value="${categoria}" selected>${categoria}</option>`;
  }

  const novoJogo = () =>{
    pegarCategorias();

    jogo = {
        perguntaGuardada: undefined, 
        dificuldade: undefined, 
        categoria: {
          id: undefined,
          name: undefined,
        },
        questionGuard: undefined,
        vezesJogadas: 0,
        acertos:0, 
        erros:0,
        pontuacao:0,
        vetor : [],

    }

    elementos.telaInicial.style.display = 'flex';
    elementos.telaJogo.style.display = 'none'; 
    elementos.telaFinal.style.display = 'none';

   
    

  }

  const guardarPergunta = () => {
    jogo.perguntaGuardada = perguntas[0];
   

    elementos.guardaPergunta.style.display = 'none';
    pegarPerguntas();
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


      if(radiobutton == perguntas[0].correct_answer && jogo.dificuldade == 'easy' && jogo.questionGuard != perguntas[0].question){
         jogo.pontuacao = jogo.pontuacao + 5;
         valor = 5;
         jogo.acertos++;
      }else if(radiobutton == perguntas[0].correct_answer && jogo.dificuldade == 'medium' && jogo.questionGuard != perguntas[0].question){
         jogo.pontuacao = jogo.pontuacao + 8;
         valor = 8;
         jogo.acertos++;
      }else if(radiobutton == perguntas[0].correct_answer && jogo.dificuldade == 'hard' && jogo.questionGuard != perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao + 10;
        valor = 10;
        jogo.acertos++;
      }else if(radiobutton != perguntas[0].correct_answer && jogo.dificuldade == 'easy' && jogo.questionGuard != perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao - 5;
        valor = -5;
        jogo.erros++;
      }else if(radiobutton != perguntas[0].correct_answer && jogo.dificuldade == 'medium' && jogo.questionGuard != perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao - 8;
        valor = -8;
        jogo.erros++;
      }else if(radiobutton != perguntas[0].correct_answer && jogo.dificuldade == 'hard' && jogo.questionGuard != perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao - 10;
        valor = -10;
        jogo.erros++;
      }else if(radiobutton == perguntas[0].correct_answer && jogo.dificuldade == 'easy' && jogo.questionGuard == perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao + 3;
        valor = +3;
        jogo.acertos++;
      }else if(radiobutton == perguntas[0].correct_answer && jogo.dificuldade == 'medium' && jogo.questionGuard == perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao + 6;
        valor = +6;
        jogo.acertos++;
      }else if(radiobutton == perguntas[0].correct_answer && jogo.dificuldade == 'hard' && jogo.questionGuard == perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao + 8;
        valor = +8;
        jogo.acertos++;
      }else if(radiobutton != perguntas[0].correct_answer && jogo.dificuldade == 'easy' && jogo.questionGuard == perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao - 5;
        valor = -5;
        jogo.erros++;
      }else if(radiobutton != perguntas[0].correct_answer && jogo.dificuldade == 'medium' && jogo.questionGuard == perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao - 8;
        valor = -8;
        jogo.erros++;
      }else if(radiobutton != perguntas[0].correct_answer && jogo.dificuldade == 'hard'&& jogo.questionGuard == perguntas[0].question){
        jogo.pontuacao = jogo.pontuacao - 10;
        valor = -10;
        jogo.erros++;
      }


    return valor;  
  }

  const colocarPerguntaAleatoria = () => {
    elementos.guardaPergunta.style.display = 'none';
    elementos.retornaPergunta.style.display = 'none';
    if(jogo.perguntaGuardada == undefined){
      elementos.guardaPergunta.style.display = 'flex';
    }
    elementos.proximaPergunta.style.display = 'none';
    elementos.submetePergunta.style.display = 'flex';
    

    

   
       if(jogo.vezesJogadas <10){
           
            elementos.divPergunta.innerHTML = `<div>${perguntas[0].question}</div>`
            elementos.divRespostas.innerHTML = ' ';
            possibilidades = perguntas[0].incorrect_answers;
            
            possibilidades.push(perguntas[0].correct_answer);
            
            possibilidades =  possibilidades.sort(() => Math.random() - 0.5)
            

            for (let j = 0; j < possibilidades.length; j++) {
              if(j==0){
                elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas"  value="${possibilidades[j]}" checked/>${possibilidades[j]}<br/></div>`
              }else{
                elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas"  value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
              }
              
            }
       }else if(jogo.vezesJogadas == 10){
          telaFinalizacao();
       }

       
       
  }

  const responderPerguntaGuardada = () =>{
      
    elementos.guardaPergunta.style.display = 'none';
    elementos.retornaPergunta.style.display = 'none';
    elementos.proximaPergunta.style.display = 'none';
    elementos.divPontuacao.style.display = 'none';
    elementos.submetePergunta.style.display = 'flex';
    
    elementos.divPergunta.innerHTML = `<div>${jogo.perguntaGuardada.question}</div>`
    elementos.divRespostas.innerHTML = ' ';
    let vetPergGuar = jogo.perguntaGuardada.incorrect_answers;
   
    
   
    possibilidades = vetPergGuar;
    perguntas[0]=jogo.perguntaGuardada;

    for (let j = 0; j < vetPergGuar.length; j++) {
      if(j==0){
        elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas"  value="${vetPergGuar[j]}" checked/>${vetPergGuar[j]}<br/></div>`
      }else{
        elementos.divRespostas.innerHTML += `<div><input type="radio" name="respostas"  value="${vetPergGuar[j]}"/>${vetPergGuar[j]}<br/></div>`
      }
      
    }
    jogo.questionGuard = jogo.perguntaGuardada.question;
    jogo.perguntaGuardada = undefined;
   



  }

  
  


  

  const respondePergunta = () =>{

    const  radiobutton = document.querySelector('input[name="respostas"]:checked').value;
      elementos.guardaPergunta.style.display = 'none';
      elementos.divRespostas.innerHTML = '';
      for (let j = 0; j < possibilidades.length; j++) {
        if(possibilidades[j]==perguntas[0].correct_answer && perguntas[0].correct_answer == radiobutton){
          elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-success text-white"><input  type="radio" name="respostas"  value="${possibilidades[j]}" checked/>${possibilidades[j]}<br/></div>`
        }else if(possibilidades[j]==perguntas[0].correct_answer  && perguntas[0].correct_answer != radiobutton ){
          elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-success text-white"><input  type="radio" name="respostas"  value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
        }else if(possibilidades[j]!=perguntas[0].correct_answer  && possibilidades[j] == radiobutton ){
          elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-danger text-white"><input  type="radio" name="respostas"  value="${possibilidades[j]}" checked/>${possibilidades[j]}<br/></div>`
        }else{
          elementos.divRespostas.innerHTML += `<div class="p-3 mb-2 bg-danger text-white"><input type="radio" name="respostas"  value="${possibilidades[j]}"/>${possibilidades[j]}<br/></div>`
        }
        
      }
      
      if(jogo.perguntaGuardada != undefined){
        elementos.retornaPergunta.style.display = 'flex';
       
      }
  
      
      elementos.submetePergunta.style.display = 'none';
      elementos.proximaPergunta.style.display = 'flex';
      elementos.divPontuacao.style.display = 'flex';
  
      const pontos = calculaPontuacao(radiobutton);
      jogo.vezesJogadas++;
      
     
      elementos.divPontuacao.innerHTML = `<div class="p-3 mb-2 bg-light text-dark"><strong>Pontua????o computada:${pontos} Pontua????o total: ${jogo.pontuacao}<strong></div>`
      
      if(jogo.erros >= 3){
        telaFinalizacao();
      }
    
     
  }
  
  const telaFinalizacao = () =>{
    elementos.telaJogo.style.display = 'none';
    elementos.telaFinal.style.display = 'flex';
    if(jogo.erros >=3 ){
      elementos.divMensagemFinal.innerHTML = 'QUE PENA, VOC?? PERDEU!';
    }else{
      elementos.divMensagemFinal.innerHTML = 'PARAB??NS, VOC?? GANHOU!'
    }

    elementos.divDados.innerHTML = `<div><Strong>Pontua????o:</strong>${jogo.pontuacao}</div>
    <div><Strong>Perguntas respondidas:</strong>${jogo.vezesJogadas}</div>
    <div><Strong>Dificuldade:</strong>${jogo.dificuldade}</div>
    <div><Strong>Categoria:</strong>${jogo.categoria.name}</div>`;
      
  }
  elementos.submetePergunta.addEventListener('click', () => respondePergunta());
  elementos.guardaPergunta.addEventListener('click', () => guardarPergunta());
  elementos.jogar.addEventListener('click', () => gerarListaPerguntas());
  elementos.retornaPergunta.addEventListener('click', () => responderPerguntaGuardada());
  elementos.proximaPergunta.addEventListener('click', () => pegarPerguntas());
    
  novoJogo();
