const urlBase = 'https://opentdb.com';
const proxy = 'https://cors-anywhere.herokuapp.com/';
let categorias; 
let perguntas; 

const elementos = {
    categoriaSelect: document.querySelector('#categoria-pergunta'), 
    telaInicial: document.querySelector('.pagina-opcoes'),
    telaJogo: document.querySelector('.jogo'),
    jogar: document.querySelector('.botao-jogar'), 
    dificulty: document.querySelector('#dificuldade-pergunta'),
    category: document.querySelector('#categoria-pergunta'),
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
          
          const aux = response.data.results;
          const aux1 = JSON.stringify(aux);
          perguntas = JSON.parse(aux1);
          console.log(perguntas);
          for (let i = 0; i < perguntas.length; i++) {
              
            //  colocarCategorias(categorias[i].name);
              //if(i===(parseInt(categorias.length)-1)){
                //elementos.categoriaSelect.innerHTML += `<option value="" selected>Selecione uma Categoria</option>`;  
              //}
          }
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

  const sortearCategoriaAleatoria = () => {
      const i = Math.floor(Math.random() * categorias.length);
      const c = categorias[i];     
      return c; 
  }




  novoJogo();
