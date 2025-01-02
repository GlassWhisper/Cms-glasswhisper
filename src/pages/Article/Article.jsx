import {useState, useEffect} from "react";
import axios from "axios";


const Article = () => {
    const [article, setArticle] = useState([]);

    useEffect(() => {
        getArticle();
    }, [setArticle]);

    const getArticle = async () => {
        const response = await axios.get("backend-rust-rho.vercel.app/api/article/");
        // console.log(response.data);
        setArticle(response.data);
    }

    return (
        <div>
            <table className="border border-black text-black bg-transparent justify-center space-x-20">
                <tr>
                    <td>image</td>
                    <td>tittle</td>
                    <td>deskripsi</td>
                </tr>
                {article.map((article,) => (
                    <tr key={article.id}>
                        <td> {article.image} </td>
                        <td> {article.title} </td>
                        <td> {article.deskripsi} </td>
                    </tr>
                ))}
            </table>
            NAVBAR
        </div>
    );
};

export default Article;
