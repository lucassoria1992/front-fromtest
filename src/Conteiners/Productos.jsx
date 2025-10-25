import React, { useMemo, useState, useEffect, useCallback } from 'react';
import UseGetItems from '../hooks/UseGetItems';
import ProductItem from '../Components/Producto';
import { Container, Row, Col, Spinner, Alert, Form, InputGroup, Button, Pagination, Card } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const ProductItemsList = () => {
    const { items, loading, error } = UseGetItems();

    // Filtros y orden
    const [query, setQuery] = useState('');
    const [onlyStock, setOnlyStock] = useState(false);
    const [sort, setSort] = useState('relevance'); // 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
    const [category, setCategory] = useState(''); // '', 'electronica', 'audio', 'gaming', 'oficina'
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const getCategory = useCallback((p) => {
        const normalize = (s) => (s || '').toString().toLowerCase();
        if (p?.categoria) return normalize(p.categoria);
        const n = normalize(p?.nombre);
        const d = normalize(p?.description);
        const hay = (arr) => arr.some(k => n.includes(k) || d.includes(k));
        if (hay(['auricular', 'micrófono', 'microfono', 'parlante', 'speaker', 'audio'])) return 'audio';
        if (hay(['mouse', 'gamer', 'gaming', 'teclado', 'rgb', 'gamepad'])) return 'gaming';
        if (hay(['impresora', 'silla', 'lámpara', 'lampara', 'soporte', 'oficina'])) return 'oficina';
        return 'electronica';
    }, []);

    const filtered = useMemo(() => {
        let list = Array.isArray(items) ? items.slice() : [];
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(p =>
                (p?.nombre || '').toLowerCase().includes(q) ||
                (p?.description || '').toLowerCase().includes(q)
            );
        }
        if (onlyStock) {
            list = list.filter(p => p?.disponible === true || p?.disponible === 'on');
        }
        if (category) {
            list = list.filter(p => getCategory(p) === category);
        }
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min)) {
            list = list.filter(p => (parseFloat(p?.price ?? 0) >= min));
        }
        if (!isNaN(max)) {
            list = list.filter(p => (parseFloat(p?.price ?? 0) <= max));
        }
        switch (sort) {
            case 'price-asc':
                list.sort((a, b) => (parseFloat(a?.price ?? 0) - parseFloat(b?.price ?? 0)));
                break;
            case 'price-desc':
                list.sort((a, b) => (parseFloat(b?.price ?? 0) - parseFloat(a?.price ?? 0)));
                break;
            case 'name-asc':
                list.sort((a, b) => (a?.nombre || '').localeCompare(b?.nombre || ''));
                break;
            case 'name-desc':
                list.sort((a, b) => (b?.nombre || '').localeCompare(a?.nombre || ''));
                break;
            default:
                break;
        }
        return list;
    }, [items, query, onlyStock, sort, category, minPrice, maxPrice, getCategory]);

    // Límites dinámicos para sliders de precio (basados en catálogo)
    const { minCatalog, maxCatalog } = useMemo(() => {
        const prices = (Array.isArray(items) ? items : []).map(p => parseFloat(p?.price ?? 0)).filter(n => !isNaN(n));
        if (prices.length === 0) return { minCatalog: 0, maxCatalog: 500 };
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        // Redondear hacia límites "lindos"
        const niceMax = Math.ceil(maxP / 50) * 50;
        const niceMin = Math.floor(minP / 50) * 50;
        return { minCatalog: Math.max(0, niceMin), maxCatalog: Math.max(50, niceMax) };
    }, [items]);

    // Valores efectivos para la barra doble (clamp + consistencia)
    const rangeMin = useMemo(() => {
        const n = parseFloat(minPrice);
        const mx = parseFloat(maxPrice || String(maxCatalog));
        const clamped = isNaN(n) ? minCatalog : Math.max(minCatalog, Math.min(n, isNaN(mx) ? maxCatalog : mx));
        return clamped;
    }, [minPrice, minCatalog, maxPrice, maxCatalog]);
    const rangeMax = useMemo(() => {
        const n = parseFloat(maxPrice);
        const mn = parseFloat(minPrice || String(minCatalog));
        const clamped = isNaN(n) ? maxCatalog : Math.min(maxCatalog, Math.max(n, isNaN(mn) ? minCatalog : mn));
        return clamped;
    }, [maxPrice, maxCatalog, minPrice, minCatalog]);
    // No necesitamos valor invertido si usamos direction: rtl en el slider de máximo

    // Paginación simple
    const pageSize = 12;
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    // Resetear a página 1 si cambia el filtro u orden
    useEffect(() => { setPage(1); }, [query, onlyStock, sort, category, minPrice, maxPrice]);

    // Cargar estado desde URL y localStorage al iniciar
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sQuery = params.get('q');
        const sStock = params.get('stock');
        const sSort = params.get('sort');
        const sCat = params.get('cat');
        const sMin = params.get('min');
        const sMax = params.get('max');
        const sPage = params.get('page');
        // URL tiene prioridad
        if (sQuery !== null) setQuery(sQuery);
        if (sStock !== null) setOnlyStock(sStock === '1');
        if (sSort !== null) setSort(sSort);
        if (sCat !== null) setCategory(sCat);
        if (sMin !== null) setMinPrice(sMin);
        if (sMax !== null) setMaxPrice(sMax);
        if (sPage !== null) setPage(parseInt(sPage) || 1);
        // Si no hay URL, cargar de localStorage
        if (!window.location.search) {
            try {
                const raw = localStorage.getItem('filters');
                if (raw) {
                    const f = JSON.parse(raw);
                    if (f.query) setQuery(f.query);
                    if (typeof f.onlyStock === 'boolean') setOnlyStock(f.onlyStock);
                    if (f.sort) setSort(f.sort);
                    if (f.category) setCategory(f.category);
                    if (f.minPrice !== undefined) setMinPrice(f.minPrice);
                    if (f.maxPrice !== undefined) setMaxPrice(f.maxPrice);
                    if (f.page) setPage(f.page);
                }
            } catch { }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persistir en URL y localStorage cuando cambien
    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (onlyStock) params.set('stock', '1');
        if (sort && sort !== 'relevance') params.set('sort', sort);
        if (category) params.set('cat', category);
        if (minPrice) params.set('min', minPrice);
        if (maxPrice) params.set('max', maxPrice);
        if (page > 1) params.set('page', String(page));
        const qs = params.toString();
        const newUrl = qs ? `?${qs}` : '';
        window.history.replaceState(null, '', newUrl);
        try {
            localStorage.setItem('filters', JSON.stringify({ query, onlyStock, sort, category, minPrice, maxPrice, page }));
        } catch { }
    }, [query, onlyStock, sort, category, minPrice, maxPrice, page]);

    return (
        <Container fluid style={{ paddingTop: 16, paddingBottom: 32 }}>
            {/* Barra de controles estilo e-commerce estética */}
                    <InputGroup size="lg" className="w-100 pill-search mb-3">
                        <InputGroup.Text><i className="fa-solid fa-magnifying-glass"></i></InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar productos, marcas, categorías…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button variant="primary" className="btn-cta" onClick={() => setQuery('')}>
                            <i className="fa-solid fa-eraser" style={{ marginRight: 6 }}></i>
                            Limpiar
                        </Button>
                    </InputGroup>
            {/* Resumen de resultados y botón para restablecer filtro si todo queda vacío */}
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div style={{ color: '#64748b' }}>
                    {filtered.length} de {items.length} productos
                </div>
                <div>
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => { setQuery(''); setOnlyStock(false); setSort('relevance'); setCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1); }}
                    >
                        Restablecer filtros
                    </Button>
                </div>
            </div>
            

            {/* Sidebar + Contenido */}
            <Row className="g-3">
                {/* Sidebar de filtros */}
                <Col xs={12} md={3}>
                    <Card className="shadow-sm" style={{ position: 'sticky', top: 16, borderRadius: 12 }}>
                        <Card.Body>
                            {/* Chips de categorías */}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                <Col xs="auto" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <Form.Check
                                        type="switch"
                                        id="only-stock"
                                        label="Solo en stock"
                                        checked={onlyStock}
                                        onChange={(e) => setOnlyStock(e.target.checked)}
                                    />
                                </Col>

                                <Col xs={12} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <InputGroup size="sm">
                                        <InputGroup.Text><i className="fa-solid fa-arrow-down-1-9"></i></InputGroup.Text>
                                        <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                                            <option value="relevance">Ordenar</option>
                                            <option value="price-asc">Precio: menor a mayor</option>
                                            <option value="price-desc">Precio: mayor a menor</option>
                                            <option value="name-asc">Nombre: A-Z</option>
                                            <option value="name-desc">Nombre: Z-A</option>
                                        </Form.Select>
                                    </InputGroup>
                                </Col>

                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                                    <Button size="sm" className="rounded-pill" variant={category === 'electronica' ? 'primary' : 'outline-primary'} onClick={() => setCategory(category === 'electronica' ? '' : 'electronica')}>
                                        <i className="fa-solid fa-laptop" style={{ marginRight: 6 }}></i>Electrónica
                                    </Button>
                                    <Button size="sm" className="rounded-pill" variant={category === 'audio' ? 'primary' : 'outline-primary'} onClick={() => setCategory(category === 'audio' ? '' : 'audio')}>
                                        <i className="fa-solid fa-headphones" style={{ marginRight: 6 }}></i>Audio
                                    </Button>
                                    <Button size="sm" className="rounded-pill" variant={category === 'gaming' ? 'primary' : 'outline-primary'} onClick={() => setCategory(category === 'gaming' ? '' : 'gaming')}>
                                        <i className="fa-solid fa-gamepad" style={{ marginRight: 6 }}></i>Gaming
                                    </Button>
                                    <Button size="sm" className="rounded-pill" variant={category === 'oficina' ? 'primary' : 'outline-primary'} onClick={() => setCategory(category === 'oficina' ? '' : 'oficina')}>
                                        <i className="fa-solid fa-print" style={{ marginRight: 6 }}></i>Oficina
                                    </Button>
                                </div>

                                {category && (
                                    <div style={{ width: '100%', marginTop: 8 }}>
                                        <Button size="sm" variant="link" onClick={() => setCategory('')}>
                                            Quitar categoría
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Rango de precio */}
                            <hr />
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, alignItems: 'center' }}>
                                <InputGroup size="sm" style={{ maxWidth: '100%' }}>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        placeholder="Precio mín"
                                        value={minPrice}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setMinPrice(v);
                                            const num = parseFloat(v);
                                            const maxNum = parseFloat(maxPrice);
                                            if (!isNaN(num) && !isNaN(maxNum) && num > maxNum) {
                                                setMaxPrice(String(num));
                                            }
                                        }}
                                    />
                                </InputGroup>
                                <InputGroup size="sm" style={{ maxWidth: '100%' }}>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        placeholder="Precio máx"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setMaxPrice(v);
                                            const num = parseFloat(v);
                                            const minNum = parseFloat(minPrice);
                                            if (!isNaN(num) && !isNaN(minNum) && num < minNum) {
                                                setMinPrice(String(num));
                                            }
                                        }}
                                    />
                                </InputGroup>

                                {/* Barra de rango dual con rc-slider */}
                                <div style={{ width: '100%', paddingTop: 8 }}>
                                    <Slider
                                        range
                                        min={minCatalog}
                                        max={maxCatalog}
                                        step={1}
                                        allowCross={false}
                                        value={[rangeMin, rangeMax]}
                                        onChange={(vals) => {
                                            const [mn, mx] = vals;
                                            setMinPrice(String(mn));
                                            setMaxPrice(String(mx));
                                        }}
                                        styles={{
                                            rail: { backgroundColor: '#e9ecef', height: 6 },
                                            track: { backgroundColor: '#0d6efd', height: 6 },
                                            handle: { borderColor: '#0d6efd', boxShadow: '0 0 0 2px rgba(13,110,253,.25)' }
                                        }}
                                    />
                                </div>

                                {(minPrice || maxPrice) && (
                                    <div style={{ width: '100%', marginTop: 8 }}>
                                        <Button size="sm" variant="outline-secondary" onClick={() => { setMinPrice(''); setMaxPrice(''); }}>Limpiar rango</Button>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Contenido: listado de productos */}
                <Col xs={12} md={9}>
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    )}

                    {error && (
                        <Alert variant="danger">No pudimos cargar los productos. Intentá recargar la página.</Alert>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <Alert variant="info">No encontramos productos que coincidan con tu búsqueda.</Alert>
                    )}

                    <Row
                        xs={1}
                        sm={2}
                        md={3}
                        lg={4}
                        className="g-3"
                        style={{ alignItems: 'stretch' }}
                    >
                        {pageItems.map((item) => (
                            <Col key={item._id} style={{ display: 'flex' }}>
                                <ProductItem item={item} />
                            </Col>
                        ))}
                    </Row>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                            <Pagination>
                                <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                    <Pagination.Item key={n} active={n === page} onClick={() => setPage(n)}>
                                        {n}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                            </Pagination>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ProductItemsList;