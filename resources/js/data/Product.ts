export class Product {
    
    /**
     * Unique identifier of the product. This is null when the product is 'new'
     */
    id?: number;

    /**
     * The name of the product.
     */
    name: string;

    /**
     * The slug created after the name. No special characters separared by
     * dashes (-).
     */
    slug: string;

    /**
     * The product's price.
     */
    price: number;

    /**
     * A descriptive text for the product. This is optional.
     */
    description?: string;

    /**
     * Product's constructor.
     * 
     * @param name The name of the product.
     * @param slug The slug created after the name. No special characters 
     *  separared by dashes (-).
     * @param price The product's price.
     * @param description A descriptive text for the product.
     * @param id Unique identifier of the product. This is null when the product 
     *  is 'new'.
     */
    constructor(name?: string, slug?: string, price?: number, description?: string, id?: number) {
        this.id = id;
        this.name = name || '';
        this.slug = slug || '';
        this.price = price || 0;
        this.description = description || '';
    }

    /**
     * Detemine if the product is new depending on the id of the product.
     */
    isNew(): boolean {
        return !this.id;
    }

    /**
     * Whether this product is the same as the given product.
     * 
     * @param product The product to compare.
     */
    isEqualToProduct(product: Product): boolean {
        return this.id === product.id;
    }

    /**
     * Whether this product is not the same as the given one.
     * 
     * @param product The product to compare.
     */
    isNotEqualToProduct(product: Product): boolean {
        return !this.isEqualToProduct(product);
    }

    /**
     * Helper method to return an array of products with the given response
     * data.
     * 
     * @param data The data array containing the product information.
     */
    static createMultipleFromResponse(data: Product[]) {
        return data.map(item => this.createSingleFromResponse(item));
    }

    /**
     * Helper method to return a product object with the given response data.
     * 
     * @param data The data object containing the product information.
     */
    static createSingleFromResponse(data: Product) {
        return new Product(data.name, data.slug, data.price, data.description, data.id);
    }
}
