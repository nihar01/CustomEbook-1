import React, {Component} from "react"
import Products from "./Products";
import productsInfo from "./Data/productInfo";


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            productInfo: []
        }
        this.setStateToFalse = this.setStateToFalse.bind(this)

    }

    setStateToFalse() {
        this.state({
            isLoading: false
        })
    }

    async componentDidMount() {

        let response = await fetch('http://localhost:8081/api/books/', {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        })
        let status = response.status;
        if (status === 200) {
            console.log("successful")
        }
        let tempProductInfo = await response.json()

        this.setState({
                productInfo: tempProductInfo,
                isLoading: false
            }
        )
    }


    render() {
        if (this.state.isLoading)
            return (
                <div>
                    <h3>loading...</h3>
                </div>
            )
        const productComponents = this.state.productInfo.map((product) => {
            return (
                <Products
                    id={product.bookId}
                    bookTitle={product.bookName}
                    authorName={product.description}
                    price={product.price}
                    img={product.imageLocation}
                    publisher={product.publisher}
                />
            )
        })
        return (
            <div className="Dashboard">
                {this.state.isLoading ? this.setStateToFalse :
                    <div>
                        <h1>Dashboard</h1>
                        {productComponents}
                    </div>}
            </div>
        )
    }
}

export default Dashboard