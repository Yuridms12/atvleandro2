import { useState } from 'react';
import { useFetch } from './hooks/useFetch';

function App() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);
  const { data: products, loading, setData } = useFetch('http://localhost:3001/products');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loadingPost) return;

    setLoadingPost(true);
    
    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          price: Number(price) 
        }),
      });

      const newProduct = await response.json();
      
      setData(prevProducts => [...prevProducts, newProduct]);
      
      
      setName('');
      setPrice('');
      
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    } finally {
      setLoadingPost(false);
    }
  };

  return (
    <div>
      <h1>Produtos</h1>
      
      
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        
        <label>
          Preço:
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        
        
        <button type="submit" disabled={loadingPost}>
          {loadingPost ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>

      
      {loading && <p>Carregando...</p>}
      <ul>
        {products && products.map(product => (
          <li key={product.id}>
            {product.name} - R$ {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;