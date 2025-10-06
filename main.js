async function carregarProdutos() {
    try {
      const response = await axios.get('http://localhost:3000/produtos');
      const produtos = response.data;
      const lista = document.getElementById('listaProdutos');
      lista.innerHTML = ''; // limpa conteúdo anterior
  
      produtos.forEach(produto => {
        const card = `
          <div class="col" data-id="${produto.id}">
            <div class="card h-100">
              <img src="img/${produto.categoria}.png" class="card-img-top img-crop"  />
              <div class="card-body">
                <h5 class="card-title">${produto.nome}</h5>
                <p class="card-text">${produto.descricao}</p>
              </div>
              <button class="btn btn-sm btn-outline-danger apagar-produto">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `;
        lista.insertAdjacentHTML('beforeend', card);
      });
  
      // Adiciona evento de clique para os botões "Apagar"
      document.querySelectorAll('.apagar-produto').forEach(botao => {
        botao.addEventListener('click', async function () {
          const card = this.closest('[data-id]');
          const id = card.getAttribute('data-id');
  
          if (confirm('Deseja realmente apagar este produto?')) {
            try {
              await axios.delete(`http://localhost:3000/produtos/${id}`);
              card.remove(); // remove visualmente do DOM
            } catch (erro) {
              console.error('Erro ao apagar produto:', erro);
              alert('Erro ao apagar o produto.');
            }
          }
        });
      });
  
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }
  
  // Chamada da função ao carregar a página
  window.addEventListener('DOMContentLoaded', carregarProdutos);

  document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault(); // impede o envio padrão do formulário
  
    const inputs = this.elements;
  
    const produto = {
      nome: inputs[0].value,
      descricao: inputs[1].value,
      preco: parseFloat(inputs[2].value.replace(',', '.')),
      categoria: inputs[3].value
    };
  
    try {
      const response = await axios.post("http://localhost:3000/produtos", produto);
      console.log("API Response:", response);
      if (response.status === 201) {
        console.log("Produto salvo com sucesso!");
        window.location.reload();
      } else {
        console.error("Erro ao salvar o produto. Status: " + response.status);
      }
      this.reset(); // limpa o formulário
    } catch (erro) {
      console.error('Erro ao salvar produto:', erro);
      alert('Erro ao salvar o produto.');
    }
  });