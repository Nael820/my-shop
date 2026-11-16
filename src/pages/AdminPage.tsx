import { useState, type FormEvent } from 'react'
import OrderList from '@/features/orders/OrderList'
import { useOrdersQuery } from '@/features/orders/queries'
import { useDeleteProduct, useCreateProduct, useUpdateProduct } from '@/features/products/adminQueries'
import { useProductsQuery } from '@/features/products/queries'
import type { CreateProductInput, Product } from '@/types/ecommerce'

type ProductFormState = {
  name: string
  slug: string
  category: string
  description: string
  image: string
  price: string
  inStock: boolean
  badge: string
}

const emptyForm: ProductFormState = {
  name: '',
  slug: '',
  category: '',
  description: '',
  image: '',
  price: '',
  inStock: true,
  badge: '',
}

function formFromProduct(product: Product): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category ?? '',
    description: product.description ?? '',
    image: product.image ?? '',
    price: String(product.price),
    inStock: product.inStock,
    badge: product.badge ?? '',
  }
}

function AdminPage() {
  const productsResult = useProductsQuery()
  const ordersResult = useOrdersQuery()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const products = productsResult.data ?? []
  const mutationError = createProduct.error ?? updateProduct.error ?? deleteProduct.error
  const mutationPending = createProduct.isPending || updateProduct.isPending || deleteProduct.isPending

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
  }

  function resetMutations() {
    createProduct.reset()
    updateProduct.reset()
    deleteProduct.reset()
    setNotice(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    resetMutations()
    const price = Number(form.price)
    if (!Number.isFinite(price) || price < 0) {
      setFormError('Saisis un prix valide, supérieur ou égal à zéro.')
      return
    }

    const product: CreateProductInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      price,
      inStock: form.inStock,
      category: form.category.trim() || undefined,
      description: form.description.trim() || undefined,
      image: form.image.trim() || undefined,
      badge: form.badge.trim() || undefined,
    }

    const onSuccess = () => {
      setNotice(editingId ? 'Produit modifié.' : 'Produit ajouté.')
      resetForm()
    }

    if (editingId) {
      updateProduct.mutate({ id: editingId, product }, { onSuccess })
    } else {
      createProduct.mutate(product, { onSuccess })
    }
  }

  function handleEdit(product: Product) {
    resetMutations()
    setFormError(null)
    setEditingId(product.id)
    setForm(formFromProduct(product))
  }

  function handleDelete(product: Product) {
    if (!window.confirm(`Supprimer « ${product.name} » du catalogue ?`)) {
      return
    }
    resetMutations()
    deleteProduct.mutate(product.id, {
      onSuccess: () => setNotice('Produit supprimé.'),
    })
  }

  return (
    <main className="admin-page">
      <header className="orders-intro admin-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> Espace administrateur</p>
        <h1>Le catalogue<em>.</em></h1>
        <p>Gérez les produits de la boutique.</p>
      </header>

      <section className="admin-metrics" aria-label="Résumé de la boutique">
        <div className="admin-metric"><span>Produits</span><strong>{products.length}</strong></div>
        <div className="admin-metric"><span>En stock</span><strong>{products.filter((product) => product.inStock).length}</strong></div>
        <div className="admin-metric"><span>Commandes</span><strong>{ordersResult.data?.length ?? '—'}</strong></div>
      </section>

      {ordersResult.error && <p className="auth-error" role="alert">{ordersResult.error.message}</p>}

      <div className="admin-layout">
        <section className="admin-products" aria-labelledby="admin-products-title">
          <div className="admin-section-heading">
            <h2 id="admin-products-title">Catalogue</h2>
            <span>{products.length} produit(s)</span>
          </div>
          {productsResult.isPending ? (
            <p className="fetch-message" role="status">Chargement du catalogue…</p>
          ) : productsResult.error ? (
            <p className="fetch-message error-message" role="alert">{productsResult.error.message}</p>
          ) : products.length === 0 ? (
            <p className="fetch-message">Aucun produit.</p>
          ) : (
            <div className="admin-product-list">
              {products.map((product) => (
                <article className="admin-product-row" key={product.id}>
                  <div className="admin-product-copy">
                    <strong>{product.name}</strong>
                    <span>{product.slug} · {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    <span>{product.inStock ? 'En stock' : 'Épuisé'}</span>
                  </div>
                  <div className="admin-product-actions">
                    <button className="remove-button" type="button" disabled={mutationPending} onClick={() => handleEdit(product)}>Modifier</button>
                    <button className="remove-button" type="button" disabled={mutationPending} onClick={() => handleDelete(product)}>Supprimer</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-form-section" aria-labelledby="admin-form-title">
          <div className="admin-section-heading">
            <h2 id="admin-form-title">{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
            {editingId && <button className="remove-button" type="button" disabled={mutationPending} onClick={resetForm}>Annuler</button>}
          </div>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="auth-field">Nom<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="auth-field">Slug<input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
            <label className="auth-field">Prix (€)<input type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
            <label className="auth-field">Catégorie<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
            <label className="auth-field">Image (URL)<input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></label>
            <label className="auth-field">Badge<input value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} /></label>
            <label className="auth-field">Description<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <label className="admin-stock-field">
              <input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} />
              Disponible en stock
            </label>
            {formError && <p className="auth-error" role="alert">{formError}</p>}
            {mutationError && <p className="auth-error" role="alert">{mutationError.message}</p>}
            {notice && <p className="auth-success" role="status">{notice}</p>}
            <button className="add-button" type="submit" disabled={mutationPending}>
              {mutationPending ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
            </button>
          </form>
        </section>
      </div>

      <section className="admin-order-summary" aria-labelledby="admin-orders-title">
        <div className="admin-section-heading">
          <h2 id="admin-orders-title">Commandes</h2>
          <span>{ordersResult.data?.length ?? 0}</span>
        </div>
        <OrderList />
      </section>
    </main>
  )
}

export default AdminPage
