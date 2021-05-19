import React, {Component, Fragment} from "react"
import productsInfo from "./Data/productInfo";
import axios from 'axios';
import Dashboard from "./Dashboard";
import BookService from "../services/BookService"
import AddChapterDetails from "./AddChapterDetails";
import {Link} from "react-router-dom";

class AdminDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookName: "",
            isbnNumber: "",
            author: "",

            yearOfRelease: "",
            publisher: "",
            price: "",
            noOfChapters: "",
            description: "",
            imageLocation: "",
            pdfFileLocation: "",
            pdfFile: null,
            userId:JSON.parse(localStorage.getItem('User')).userId,
            bookId: null
        }

        axios.get("http://localhost:8081/api/users/"+this.state.userId).then((res)=>
        {
            console.log(res)
            console.log(res.data)
            this.setState({
                publisher: res.data.companyName
            })
        })

        console.log(this.state.publisher)
        this.handleChange = this.handleChange.bind(this)
        this.logout = this.logout.bind(this)
        this.onSubmit=this.onSubmit.bind(this)
        this.temp=this.temp.bind(this)
    }

    logout() {
        alert("Logging out...")
        localStorage.removeItem('userId');
        localStorage.removeItem('User');
    }

    handleChange(event) {

        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }
    async temp(){
        let response = await fetch('http://localhost:8081/api/users/'+this.state.userId+'/uploadBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body:JSON.stringify({
                bookName: this.state.bookName,
                isbnNumber: this.state.isbnNumber,
                author: this.state.author,
                publisher: this.state.publisher,
                price: this.state.price,
                noOfChapters: this.state.noOfChapters,
                description: this.state.description,
                imageLocation: this.state.imageLocation,
                pdfFileLocation: this.state.pdfFileLocation,
                yearOfRelease: this.state.yearOfRelease
            })
        })
        let apiResults= await response.json()
        this.setState({
            bookId: apiResults.bookId
        })
        console.log(apiResults)
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.temp().then()
        // let book = {
        //     bookName: this.state.bookName,
        //     isbnNumber: this.state.isbnNumber,
        //     author: this.state.author,
        //     publisher: this.state.publisher,
        //     price: this.state.price,
        //     noOfChapters: this.state.noOfChapters,
        //     description: this.state.description,
        //     imageLocation: this.state.imageLocation,
        //     pdfFileLocation: this.state.pdfFileLocation,
        //     yearOfRelease: this.state.yearOfRelease
        // }
        //
        // console.log('Book =>' + JSON.stringify(book));
        //
        // BookService.createBook(book).then((res) => {
        //
        //
        //     console.log("admindash-data.bookid", res.bookId)
        //     this.setState({
        //         bookId: res.bookId
        //     })
        //     // this.props.history.push({
        //     //     pathname: '/AddChapterDetails', state: {
        //     //         bookId: res.bookId,
        //     //         totalChapter: this.state.noOfChapters
        //     //     }
        //     // });
        // }).catch((err)=>{
        //     alert(err)
        // });


    }
    onFileChange = event => {
        console.log(event.target.files[0])
        // Update the state
        this.setState({pdfFile: event.target.files[0]});

    };
    onFileUpload = (e) => {
        e.preventDefault();

        console.log(this.state.pdfFile)
        console.log(this.state.pdfFile.name)
        var name = this.state.pdfFile.name;
        // var pdfFolder = "/home/lumos/Desktop/DMProject/Books"        //set the appropriate path name to store pdf
        // this.state.pdfFileLocation = pdfFolder.concat(name)



        let formData = new FormData();

        // Update the formData object
        formData.append(
            "file",
            this.state.pdfFile
        );
        formData.append(
            "bookId", this.state.bookId
        )
        console.log(formData.get('file'))
        console.log(formData.get('bookId'))
        BookService.savePdfFile(formData).then((res) => {
            console.log("response-onfileupload()", res)
            console.log(this.state.noOfChapters)
            if(this.state.noOfChapters !== 0){
                this.props.history.push({
                pathname: '/AddChapterDetails',
                    bookId: this.state.bookId,
                    totalChapter: this.state.noOfChapters
                
                });
            }
            
            // this.props.history.push({pathname:'/AddChapterDetails',state: {
            //   bookId: res.bookId}});
        });
    }
    componentDidMount() {
        if (this.state.userId === undefined) {
            console.log("AdminDashboard:getting UserId")
            this.setState({
                userId: JSON.parse(localStorage.getItem('userId')),
            },()=>console.log("AdminDashboard userId:",this.state.userId))

        } else {
            console.log("AdminDashboard: setting UserId:" ,this.state.userId)
            localStorage.setItem('userId', JSON.stringify(this.state.userId));
        }
        // axios.get("http://localhost:8081/api/users/"+this.state.userId).then((res)=>
        // {
        //     this.setState({
        //         publisher: res.companyName
        //     })
        // })
        
    }


    render() {
        return (
            <div>
                <div className="Navbar">
                    <nav>
                        <ul>

                            <li><Link to="/Publisher">Profile</Link></li>

                            <li><Link to="/" onClick={this.logout}>Logout</Link></li>
                        </ul>
                    </nav>
                    <h1 style={{color:'white'}}>Dashboard</h1>
                </div>


                <div className="bookUpload">
                    
                    <div>
                        <form>
                            
                            <h2>
                                Enter Book Details
                            </h2>
                            <div className="bookUploadEnter">
                                <label>ISBN Number:</label>
                                <input
                                    type="number"
                                    name="isbnNumber"
                                    required="True"
                                    placeholder="ISBN Number"
                                    value={this.state.isbnNumber}
                                    onChange={this.handleChange}/>

                                <label>Book Name:</label>
                                <input type="text"
                                       name="bookName"    //need to add change handler function for name
                                       required="True"
                                       placeholder="Book Name"
                                       value={this.state.bookName}
                                       onChange={this.handleChange}/>
                                <label>Author name:</label>
                                <input
                                    type="text"
                                    name="author"
                                    required="True"
                                    placeholder="Author name"
                                    value={this.state.author}
                                    onChange={this.handleChange}/>
                                <label>Publisher:</label>
                                <input
                                    type="text"
                                    name="publisher"
                                    required="True"
                                    placeholder="Publisher"
                                    value={this.state.publisher}
                                    readOnly
                                    onChange={this.handleChange}
                                />

                                <label>Year of Release:</label>
                                <input
                                    type="number"
                                    name="yearOfRelease"
                                    required="True"
                                    placeholder="Year of Release"
                                    value={this.state.yearOfRelease}
                                    onChange={this.handleChange}/>
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    required="True"
                                    placeholder="Price"
                                    value={this.state.price}
                                    onChange={this.handleChange}/>
                                <label>Number of Chapters:</label>

                                <input
                                    type="number"
                                    name="noOfChapters"
                                    required="True"
                                    placeholder="Number of Chapters"
                                    value={this.state.noOfChapters}
                                    onChange={this.handleChange}/>


                                <label>Description:</label>
                                <input
                                    type="text"
                                    name="description"
                                    required="True"
                                    placeholder="Description"
                                    value={this.state.description}
                                    onChange={this.handleChange}/>
                                <label>Image Location</label>
                                <input
                                    type="text"
                                    name="imageLocation"
                                    required="True"
                                    placeholder="Image Location"
                                    value={this.state.imageLocation}
                                    onChange={this.handleChange}/>

                                {/* <input

                                type="text"
                                name="pdfFileLocation"
                                required="True"
                                placeholder="PDF Location"
                                value={this.state.pdfFileLocation}
                                onChange={this.handleChange}/> */}


                                {/* <h3>Upload Book Cover:</h3>
                            <input type="file" onChange={this.onFileChange}/> */}

                                <br/>
                                <button onClick={this.onSubmit}>
                                    Save Book details
                                </button>
                            </div>
                            {this.state.bookId && (
                                <Fragment>
                                    <hr/>
                                    <h2>
                                        Upload the Ebook here
                                    </h2>
                                    <div className="bookUploadEnter">
                                        <label>Choose Book</label>
                                        <input type="file" class="form-control-file" id="pdfFile" name="pdfFile" accept=".pdf"
                                            onChange={this.onFileChange}/>
                                            <div/>
                                        <button onClick={this.onFileUpload}>
                                            Upload Book
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                            

                        </form>
                    </div>
                    {/* {this.fileData()} */}
                </div>

                <div className="box hide">

                </div>
            </div>
        );
    }
}

export default AdminDashboard
