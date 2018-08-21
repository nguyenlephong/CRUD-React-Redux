import React, { Component } from 'react';
import './ProductListPage.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

import MyButton from 'components/button/Button';
import MyDropdownList from 'components/dropdown/MyDropdownBT.js';
import { actFetchProductsRequest, actDeleteProductRequest, searchProductRequest,getTotalProduct } from 'redux/productManagement/actions/index';
import {actFetchCategoryProductRequest} from 'redux/productManagement/actions/cates';
import {FormGroup,FormControl,Form,Button} from 'react-bootstrap';
class ProductListPage extends Component {  
    constructor(props){
        super(props);
        this.state={
            iSearch:"ALL",
            pageSize:5,
            pageIndex:1,
            listPageVisit:[1],
            listPageVisitFilter:[1],
        };
    }
    componentDidMount(){
        var {pageSize,pageIndex,iSearch} = this.state;
        this.props.fetchAllProducts(pageSize,pageIndex,iSearch);
        this.props.fetchAllCategoryProduct();
    }
    componentWillMount(){
        // Gọi trước khi component đc render lần đầu tiên 
        var {pageSize,pageIndex,iSearch} = this.state;
        this.props.fetchAllProducts(pageSize,pageIndex,iSearch);
        this.props.fetchAllCategoryProduct();
    }
    onChange=e =>{
        if(e.target.value===''){
            this.setState({iSearch:"ALL"});
            this.props.fetchAllProducts(this.state.pageSize,this.state.pageIndex,"ALL");
            this.props.fetchAllCategoryProduct();
        }else{
            this.setState({iSearch:e.target.value},function(){
             this.props.searchProduct(this.state.pageSize,this.state.pageIndex,this.state.iSearch);
            });
        }
        this.setState({
            listPageVisit:[],
            listPageVisitFilter:[],
        });
    }

    searchHandle=e=>{
        e.preventDefault();
        var word = this.state.iSearch;
        if(word!==''){
            if(word==='ALL'){
                this.props.fetchAllProducts(this.state.pageSize,this.state.pageIndex,"ALL");
                this.props.fetchAllCategoryProduct();
            }else{
                console.log(word+" is word search, pageSize: "+this.state.pageSize+" pageInd: "+this.state.pageIndex);
                this.props.searchProduct(this.state.pageSize,this.state.pageIndex,word);
            }
        }else{
            console.log("Lỗi này hơi bị ghê!!!");
        }
        this.setState({
            listPageVisit:[],
            listPageVisitFilter:[],
        });
       
    }

    render() {
        var { isFetching,products,categorys,fetchAllProducts,searchProduct,saveCateCode } = this.props;
        return (
            <div className="container-content">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="container-table">
                            <div className="row-button">
                                <div className="button-left">
                                    <Link to="/product/add" className="btn btn-primary mb-5">
                                        <i className="glyphicon glyphicon-plus"></i> Thêm Sản Phẩm
                                    </Link>
                                </div>
                                <div className="button-right" style={{width:'100px'}}>
                                    <Form inline onSubmit={this.searchHandle}>
                                        <FormGroup controlId="formInlineName">
                                            <FormControl onChange={this.onChange} type="text" name="iSearch" ref="iSearch" placeholder="Search by word..." />
                                        </FormGroup>{' '}
                                        <Button type="submit">Search</Button>
                                    </Form>
                                </div>
                                <div className="button-right">
                                    <div className="backGround-dropdown" 
                                            onClick={()=>{
                                                this.setState({isActiveDropdown:true})
                                            }}>
                                        <MyDropdownList
                                         pagination={[ 
                                             this.state.pageIndex,
                                             this.state.pageSize,
                                            ]} 
                                         cateButton="Primary" 
                                         title="Category" id="1" 
                                         listCate={categorys}/>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <br/>
                           <div style={{width:'100%',marginTop:'30px',}}>
                           <ReactTable data={products}
                                        loading={isFetching}
                                        defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
                                        columns={[
                                        {
                                            Header: "ID",
                                            id: "productId",
                                            accessor: d => d.productId,
                                            filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["productId"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Name",
                                            id: "productName",
                                            accessor: d => d.productName,
                                            filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["productName"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Category",
                                            id: "productCategoryCode",
                                            accessor: d => d.productCategoryCode,
                                            filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["productCategoryCode"] }),
                                            Cell: row=>{

                                                var result ="";
                                                categorys.forEach((cate, index) => {
                                                    if (cate.productCategoryCode === row.value) {
                                                        result = cate.productCategoryDescription;
                                                    }
                                                });
                                                return result;
                                            }
                                            ,
                                            
                                            filterAll: true
                                        },
                                        {
                                            Header: "Detail",
                                            id: "otherProductDetails",
                                            accessor: d => d.otherProductDetails,
                                            filterMethod: (filter, rows) =>
                                            matchSorter(rows, filter.value, { keys: ["otherProductDetails"] }),
                                            filterAll: true
                                        },
                                        {
                                            
                                            Header: "Edit",
                                            accessor:"productId",
                                            filterable:false,
                                            Cell: row => (
                                            <div className="button-table"> 
                                                <MyButton small aria_label='EDIT' 
                                                    productId={row.value} 
                                                    pagination={[
                                                        this.state.pageIndex,
                                                        this.state.pageSize,
                                                        this.state.iSearch
                                                    ]}/>
                                            </div>
                                            )
                                        },
                                        {   
                                            Header: "Delete",
                                            accessor:"productId",
                                            filterable:false,
                                            Cell: row => (
                                            <div className="button-table"> 
                                                <MyButton size="small" 
                                                    aria_label='DELETE' 
                                                    productId={row.value} 
                                                    pagination={[this.state.pageIndex,this.state.pageSize,this.state.iSearch]}/> 
                                            </div>
                                            )
                                        }]}
                                        defaultPageSize={5}
                                        onPageChange={(pageInd) => {
                                            var stringFilter=(saveCateCode!=='null')?saveCateCode:this.state.iSearch;
                                            if(saveCateCode==='all-cate'){
                                                this.setState({
                                                    listPageVisit:[],
                                                    listPageVisitFilter:[],
                                                    iSearch:'ALL'
                                                });
                                            }
                                            if(saveCateCode==='null'||saveCateCode==='all-cate'){
                                                if(stringFilter===''||stringFilter===0||stringFilter==="ALL"){
                                                    var pageVisit = this.state.listPageVisit;
                                                    this.setState({
                                                    pageIndex:pageInd+1,
                                                    listPageVisitFilter:[],
                                                    isActiveDropdown:false,
                                                },
                                                    function(){
                                                        // console.log(this.state.listPageVisit);
                                                        var isPageVisit= this.state.listPageVisit.includes(pageInd+1);
                                                        if(isPageVisit===false){
                                                            pageVisit.push(pageInd+1);
                                                            this.setState({listPageVisit:pageVisit, });
                                                            fetchAllProducts(
                                                                this.state.pageSize,
                                                                this.state.pageIndex,
                                                                "ALL"
                                                            );
                                                           
                                                        }
                                                    });
                                                }else{
                                                    this.setState({pageIndex:pageInd+1,listPageVisit:[]},
                                                        function(){
                                                            var pageVisit = this.state.listPageVisitFilter;
                                                            var isPageVisit= this.state.listPageVisitFilter.includes(pageInd+1);
                                                            if(isPageVisit===false){
                                                                pageVisit.push(pageInd+1);
                                                                this.setState({listPageVisitFilter:pageVisit, });
                                                                searchProduct(
                                                                    this.state.pageSize,
                                                                    this.state.pageIndex,
                                                                    stringFilter
                                                                );
                                                            }
        
                                                        });
                                                    }
                                            }else{
                                                this.setState({
                                                    listPageVisit:[],
                                                    listPageVisitFilter:[],
                                                    pageIndex:pageInd+1,
                                                },()=>{
                                                    var pageVisit = this.state.listPageVisitFilter;
                                                    var isPageVisit= this.state.listPageVisitFilter.includes(pageInd+1);
                                                    if(isPageVisit===false){
                                                        pageVisit.push(pageInd+1);
                                                        this.setState({listPageVisitFilter:pageVisit, });
                                                        searchProduct(
                                                            this.state.pageSize,
                                                            this.state.pageIndex,
                                                            stringFilter
                                                        );
                                                    }
                                                });

                                            }
                                        } 
                                        } // Called when the page index is changed by the user
                                        onPageSizeChange={(pSize, pIndex) => {
                                            this.setState({
                                                pageIndex:pIndex+1,
                                                pageSize:pSize,
                                                listPageVisit:[],
                                                listPageVisitFilter:[],
                                            },
                                                function(){
                                                    if(this.state.iSearch===0||
                                                        this.state.iSearch===''||
                                                        this.state.iSearch==="ALL"){
                                                            fetchAllProducts(
                                                                this.state.pageSize,
                                                                this.state.pageIndex,
                                                                "ALL"
                                                            );
                                                        }else{
                                                            searchProduct(
                                                                this.state.pageSize,
                                                                this.state.pageIndex,
                                                                this.state.iSearch
                                                            );
                                                        }
                                                });                                            
                                            }
                                        } 
                                        className="-striped -highlight"
                                    />
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
const mapStateToProps = state => {
    return {
        saveCateCode:state.saveCateCode,
        totalData:state.totalData,
        products: state.products,
        categorys: state.categorys,
        isFetching:state.isFetching
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllProducts: (pageSize,pageIndex,StringFilter) => {
            dispatch(actFetchProductsRequest(pageSize,pageIndex,StringFilter));
        },
        fetchAllCategoryProduct:()=>{
            dispatch(actFetchCategoryProductRequest());
        },
        onDeleteProduct: (id) => {
            dispatch(actDeleteProductRequest(id));
        },
        searchProduct: (pageSize,pageNow,keywork) => {
            dispatch(searchProductRequest(pageSize,pageNow,keywork))
        },
        getTotalData: (stringFilter,condition) => {
            dispatch(getTotalProduct(stringFilter,condition))
        },
        

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListPage);