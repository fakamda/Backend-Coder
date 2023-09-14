export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = async () => await this.dao.getAll();
    getById = async (id) => await this.dao.getById(id);
    create = async (data) => await this.dao.create(data);
    update = async (id, data) => await this.dao.update(id, data);
    delete = async (id) => await this.dao.delete(id);
    removeProductFromCart = async (cartId, productId) => await this.dao.removeProductFromCart(cartId, productId)
}