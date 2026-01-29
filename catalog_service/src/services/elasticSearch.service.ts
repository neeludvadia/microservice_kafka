import { CatalogProduct } from "../dto/payload.dto";
import { EventPayload } from "../utils/AppEventListener";
import { Client } from "@elastic/elasticsearch";


export class ElasticSearchService {
  private indexName = "product";
  private client:Client;

  constructor(){
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || "http://localhost:8200",
    });
  }

  async handleEvents({event,data}:EventPayload){
    console.log("ElasticSearchService:handleEvents",event,data);
    switch (event){
      case "createProduct":
        await this.createProduct(data as CatalogProduct);
        console.log("Create product event received in ElasticSearchService");
        return;
      case "updateProduct":
        await this.updateProduct(data as CatalogProduct);
        console.log("Update product event receivedd in ElasticSearchService");
        return;
      case "deleteProduct":
        const {id} = data as CatalogProduct;
        await this.deleteProduct(id);
        console.log("Delete product event received in ElasticSearchService");
    }
  }

  //index is refer as table in elastic search
  async createIndex(){

    //if table is already exists or not
    const indexExists = await this.client.indices.exists({index:this.indexName});
    //if not then create one
    if(!indexExists){
      await this.client.indices.create({
        index:this.indexName,
        body:{
          mappings:{
              properties:{
                id:{ type:"keyword" },
                title:{ type: "text"},
                description: { type: "text"},
                price: { type: "float" },
                stock: { type: "integer" },
              },
            },
        },
      });
    }
  }

  async getProduct(id:string){
    const result = await this.client.get({
      index:this.indexName,
      id,
    });
    return result._source;
  }
  
  async createProduct(data: CatalogProduct){
    await this.client.index({
      index: this.indexName,
      id: data.id.toString(),
      document:{...data}
    });
    console.log("product created with id", data.id);
  }

  async updateProduct(data: CatalogProduct){
    await this.client.update({
      index: this.indexName,
      id:data.id.toString(),
      doc: data,
    });
    console.log("product updated with id", data.id);
  }

  async deleteProduct(id: number){
    await this.client.delete({
      index: this.indexName,
      id: id.toString(),
    });
    console.log("product deleted with id", id);
  };

  async searchProduct(queryString: string){
    const result = await this.client.search({
      index:this.indexName,
      query:
        queryString.length === 0 ?{
          match_all:{},
        }
        :
        {
        multi_match:{
          query:queryString,
          fields:["title","description"],
          fuzziness:"AUTO",
        },
      },
    });
    return result.hits.hits.map((hit)=> hit._source);
  }

}