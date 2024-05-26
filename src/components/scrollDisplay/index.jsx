import { useEffect, useState } from 'react';
import './styles.css';

export default function ScrollDisplay({ url }) {
    const [products, setProducts] = useState([]);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchProducts() {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(url);
            if (!res.ok) {
                return new Error('Error occured. Please try again.');
            }
            const data = await res.json();
            data?.products?.length && setProducts(data.products);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleScrollPercentage() {
        const amountScrolled = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollPercentage((amountScrolled / height) * 100);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScrollPercentage);

        return (
            window.removeEventListener('scroll', () => { })
        )
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [url]);

    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>{error}</div>
    }

    console.log(scrollPercentage);

    return (
        <div className='container'>
            <div className='top-container'>
                <h1>Scroll Display</h1>
                <div className='scroll-display-container'>
                    <div className='scroll-display-progress-bar' style={{ width: `${scrollPercentage}%` }}></div>
                </div>
            </div>
            <div>
                <ul className='product-list'>
                    {
                        products.map(product => (
                            <li key={product.id} className='product'>{product.title}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )

}