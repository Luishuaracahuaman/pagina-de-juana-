// JavaScript separado - Funcionalidad de la aplicación
console.log("JavaScript cargado correctamente");
// Datos de ejemplo para la aplicación
let medications = JSON.parse(localStorage.getItem('medications')) || [
    { 
        id: 1, 
        name: "Paracetamol 500mg", 
        lot: "PTM-2023-001", 
        stock: 15, 
        minStock: 20, 
        category: "analgesico",
        expiration: "2023-12-31",
        status: "warning" 
    },
    { 
        id: 2, 
        name: "Amoxicilina 250mg", 
        lot: "AMX-2023-005", 
        stock: 5, 
        minStock: 15, 
        category: "antibiotico",
        expiration: "2023-05-31",
        status: "danger" 
    },
    { 
        id: 3, 
        name: "Ibuprofeno 400mg", 
        lot: "IBP-2023-008", 
        stock: 22, 
        minStock: 25, 
        category: "antiinflamatorio",
        expiration: "2024-02-28",
        status: "warning" 
    },
    { 
        id: 4, 
        name: "Loratadina 10mg", 
        lot: "LOR-2023-003", 
        stock: 0, 
        minStock: 10, 
        category: "antihistaminico",
        expiration: "2023-09-30",
        status: "danger" 
    },
    { 
        id: 5, 
        name: "Omeprazol 20mg", 
        lot: "OMP-2023-006", 
        stock: 18, 
        minStock: 15, 
        category: "otros",
        expiration: "2023-12-15",
        status: "success" 
    }
];

let movements = JSON.parse(localStorage.getItem('movements')) || [
    {
        id: 1,
        medicationId: 1,
        type: "salida",
        quantity: 5,
        date: "2023-05-12",
        reason: "Consulta médica",
        user: "Juan Pérez"
    },
    {
        id: 2,
        medicationId: 2,
        type: "entrada",
        quantity: 50,
        date: "2023-05-11",
        reason: "Compra",
        user: "María López"
    },
    {
        id: 3,
        medicationId: 3,
        type: "salida",
        quantity: 12,
        date: "2023-05-10",
        reason: "Urgencias",
        user: "Carlos Rodríguez"
    },
    {
        id: 4,
        medicationId: 4,
        type: "salida",
        quantity: 8,
        date: "2023-05-09",
        reason: "Consulta médica",
        user: "Ana García"
    },
    {
        id: 5,
        medicationId: 5,
        type: "entrada",
        quantity: 30,
        date: "2023-05-08",
        reason: "Compra",
        user: "Luisa Martínez"
    }
];

let settings = JSON.parse(localStorage.getItem('settings')) || {
    institution: "Instituto Valle Grande",
    department: "Tópico Médico",
    backupFrequency: "semanal",
    language: "es",
    alertDays: 30,
    alertPercentage: 20
};

// Variables globales
let currentPage = 'dashboard';
let currentTab = 'critical';
let currentReportType = '';

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    bindEvents();
});

// Inicializar la aplicación
function initializeApp() {
    // Cargar datos iniciales
    loadDashboardData();
    loadInventoryData();
    loadMovementsData();
    loadKardexData();
    loadAlertsData();
    loadReportsData();
    loadSettingsData();
    
    // Inicializar menú responsivo
    initResponsiveMenu();
}

// Vincular eventos
function bindEvents() {
    // Menú lateral
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            changePage(target);
            
            // Actualizar clase activa
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Tabs del dashboard
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            changeTab(tabId);
            
            // Actualizar clase activa
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // Modal de agregar medicamento
    const addMedicationBtn = document.getElementById('addMedicationBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('addMedicationModal');
    const saveMedicationBtn = document.getElementById('saveMedicationBtn');
    
    addMedicationBtn.addEventListener('click', () => {
        openModal(modal);
    });
    
    closeModalBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    saveMedicationBtn.addEventListener('click', () => {
        saveMedication();
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Botón de toggle del menú responsivo
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', toggleMenu);
    
    // Botones de acción en las tablas
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-btn') || e.target.parentElement.classList.contains('action-btn')) {
            const btn = e.target.classList.contains('action-btn') ? e.target : e.target.parentElement;
            const icon = btn.querySelector('i');
            handleActionButton(icon.classList[1], btn);
        }
    });
    
    // Inventario
    const refreshInventoryBtn = document.getElementById('refreshInventoryBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    refreshInventoryBtn.addEventListener('click', loadInventoryData);
    applyFiltersBtn.addEventListener('click', applyInventoryFilters);
    clearFiltersBtn.addEventListener('click', clearInventoryFilters);
    
    // Movimientos
    const newMovementBtn = document.getElementById('newMovementBtn');
    const saveMovementBtn = document.getElementById('saveMovementBtn');
    
    newMovementBtn.addEventListener('click', showMovementForm);
    saveMovementBtn.addEventListener('click', saveMovement);
    
    // Kardex
    const generateKardexBtn = document.getElementById('generateKardexBtn');
    const exportKardexBtn = document.getElementById('exportKardexBtn');
    
    generateKardexBtn.addEventListener('click', generateKardex);
    exportKardexBtn.addEventListener('click', exportKardex);
    
    // Alertas
    const configureAlertsBtn = document.getElementById('configureAlertsBtn');
    const saveAlertsConfigBtn = document.getElementById('saveAlertsConfigBtn');
    
    configureAlertsBtn.addEventListener('click', toggleAlertsConfig);
    saveAlertsConfigBtn.addEventListener('click', saveAlertsConfig);
    
    // Reportes
    const generateReportBtn = document.getElementById('generateReportBtn');
    const generateReportNowBtn = document.getElementById('generateReportNowBtn');
    const reportOptions = document.querySelectorAll('.report-option');
    
    generateReportBtn.addEventListener('click', showReportParams);
    generateReportNowBtn.addEventListener('click', generateReport);
    
    reportOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectReportType(option.getAttribute('data-report'));
        });
    });
    
    // Configuración
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    saveSettingsBtn.addEventListener('click', saveSettings);
}

// Cambiar de página
function changePage(page) {
    // Ocultar página actual
    document.querySelector(`.page-section.active`).classList.remove('active');
    
    // Mostrar nueva página
    document.getElementById(page).classList.add('active');
    
    // Actualizar variable global
    currentPage = page;
    
    // Cargar datos específicos de la página
    loadPageData(page);
    
    // Mostrar notificación de cambio de página
    showNotification(`Has cambiado a la página: ${getPageName(page)}`);
}

// Cambiar de pestaña
function changeTab(tab) {
    // Ocultar pestaña actual
    document.querySelector(`.tab-content.active`).classList.remove('active');
    
    // Mostrar nueva pestaña
    document.querySelector(`[data-tab-content="${tab}"]`).classList.add('active');
    
    // Actualizar variable global
    currentTab = tab;
}

// Abrir modal
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Toggle del menú responsivo
function toggleMenu() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Manejar botones de acción
function handleActionButton(iconClass, button) {
    const medicationId = button.getAttribute('data-id');
    
    switch(iconClass) {
        case 'fa-edit':
            editMedication(medicationId);
            break;
        case 'fa-exchange-alt':
            showMovementForm(medicationId);
            break;
        case 'fa-chart-line':
            showKardex(medicationId);
            break;
        case 'fa-trash':
            deleteMedication(medicationId);
            break;
        default:
            console.log('Acción no definida');
    }
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Actualizar estadísticas
    updateDashboardStats();
    
    // Cargar medicamentos críticos
    loadCriticalMedications();
    
    // Cargar movimientos recientes
    loadRecentMovements();
    
    // Cargar medicamentos por vencer
    loadExpiringMedications();
}

// Actualizar estadísticas del dashboard
function updateDashboardStats() {
    const totalMedications = medications.length;
    const stableMedications = medications.filter(m => m.status === 'success').length;
    const lowStockMedications = medications.filter(m => m.status === 'warning').length;
    const outOfStockMedications = medications.filter(m => m.status === 'danger' && m.stock === 0).length;
    
    document.getElementById('total-medicamentos').textContent = totalMedications;
    document.getElementById('medicamentos-estables').textContent = stableMedications;
    document.getElementById('stock-bajo').textContent = lowStockMedications;
    document.getElementById('medicamentos-agotados').textContent = outOfStockMedications;
}

// Cargar medicamentos críticos
function loadCriticalMedications() {
    const tbody = document.getElementById('critical-medications');
    tbody.innerHTML = '';
    
    const criticalMeds = medications.filter(m => m.status === 'warning' || m.status === 'danger');
    
    criticalMeds.forEach(med => {
        const statusText = med.status === 'danger' && med.stock === 0 ? 'Agotado' : 
                          med.status === 'danger' ? 'Crítico' : 'Por debajo';
        
        const statusClass = med.status === 'danger' && med.stock === 0 ? 'status-danger' : 
                           med.status === 'danger' ? 'status-danger' : 'status-warning';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.lot}</td>
            <td>${med.stock}</td>
            <td>${med.minStock}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button class="action-btn" data-id="${med.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn" data-id="${med.id}"><i class="fas fa-exchange-alt"></i></button>
                <button class="action-btn" data-id="${med.id}"><i class="fas fa-chart-line"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar movimientos recientes
function loadRecentMovements() {
    const tbody = document.getElementById('recent-movements');
    tbody.innerHTML = '';
    
    // Ordenar movimientos por fecha (más recientes primero)
    const recentMovements = [...movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    
    recentMovements.forEach(mov => {
        const medication = medications.find(m => m.id === mov.medicationId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(mov.date)}</td>
            <td>${medication ? medication.name : 'Medicamento no encontrado'}</td>
            <td>${mov.type === 'entrada' ? 'Entrada' : 'Salida'}</td>
            <td>${mov.quantity}</td>
            <td>${mov.user}</td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar medicamentos por vencer
function loadExpiringMedications() {
    const tbody = document.getElementById('expiring-medications');
    tbody.innerHTML = '';
    
    const today = new Date();
    const alertDate = new Date();
    alertDate.setDate(today.getDate() + settings.alertDays);
    
    const expiringMeds = medications.filter(med => {
        const expDate = new Date(med.expiration);
        return expDate <= alertDate;
    }).sort((a, b) => new Date(a.expiration) - new Date(b.expiration));
    
    expiringMeds.forEach(med => {
        const expDate = new Date(med.expiration);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let statusText, statusClass;
        if (diffDays < 0) {
            statusText = 'Vencido';
            statusClass = 'status-danger';
        } else if (diffDays <= 30) {
            statusText = 'Por vencer';
            statusClass = 'status-warning';
        } else {
            statusText = 'Vigente';
            statusClass = 'status-success';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.lot}</td>
            <td>${formatDate(med.expiration)}</td>
            <td>${diffDays}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar datos de inventario
function loadInventoryData() {
    const tbody = document.getElementById('inventory-table');
    tbody.innerHTML = '';
    
    medications.forEach(med => {
        const statusText = getStatusText(med);
        const statusClass = getStatusClass(med);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.lot}</td>
            <td>${getCategoryName(med.category)}</td>
            <td>${med.stock}</td>
            <td>${med.minStock}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${formatDate(med.expiration)}</td>
            <td>
                <button class="action-btn" data-id="${med.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn" data-id="${med.id}"><i class="fas fa-exchange-alt"></i></button>
                <button class="action-btn" data-id="${med.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    showNotification('Inventario actualizado', 'success');
}

// Aplicar filtros de inventario
function applyInventoryFilters() {
    const categoryFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;
    const searchFilter = document.getElementById('search-inventory').value.toLowerCase();
    
    const tbody = document.getElementById('inventory-table');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const name = cells[0].textContent.toLowerCase();
        const lot = cells[1].textContent.toLowerCase();
        const category = cells[2].textContent.toLowerCase();
        const status = cells[5].querySelector('.status').textContent.toLowerCase();
        
        const categoryMatch = !categoryFilter || category.includes(categoryFilter);
        const statusMatch = !statusFilter || status.includes(statusFilter);
        const searchMatch = !searchFilter || name.includes(searchFilter) || lot.includes(searchFilter);
        
        if (categoryMatch && statusMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    showNotification('Filtros aplicados', 'success');
}

// Limpiar filtros de inventario
function clearInventoryFilters() {
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('search-inventory').value = '';
    
    applyInventoryFilters();
    showNotification('Filtros limpiados', 'success');
}

// Cargar datos de movimientos
function loadMovementsData() {
    // Cargar select de medicamentos
    const medicationSelect = document.getElementById('movement-medication');
    medicationSelect.innerHTML = '<option value="">Seleccione medicamento</option>';
    
    medications.forEach(med => {
        const option = document.createElement('option');
        option.value = med.id;
        option.textContent = `${med.name} (${med.lot})`;
        medicationSelect.appendChild(option);
    });
    
    // Cargar tabla de movimientos
    const tbody = document.getElementById('movements-table');
    tbody.innerHTML = '';
    
    // Ordenar movimientos por fecha (más recientes primero)
    const sortedMovements = [...movements].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedMovements.forEach(mov => {
        const medication = medications.find(m => m.id === mov.medicationId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(mov.date)}</td>
            <td>${medication ? medication.name : 'Medicamento no encontrado'}</td>
            <td>${medication ? medication.lot : '-'}</td>
            <td>${mov.type === 'entrada' ? 'Entrada' : 'Salida'}</td>
            <td>${mov.quantity}</td>
            <td>${mov.reason}</td>
            <td>${mov.user}</td>
        `;
        tbody.appendChild(row);
    });
}

// Mostrar formulario de movimiento
function showMovementForm(medicationId = null) {
    const formContainer = document.getElementById('movement-form-container');
    
    // Si se pasa un medicationId, preseleccionar ese medicamento
    if (medicationId) {
        document.getElementById('movement-medication').value = medicationId;
    }
    
    // Establecer fecha actual por defecto
    document.getElementById('movement-date').value = new Date().toISOString().split('T')[0];
    
    // Hacer scroll al formulario
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

// Guardar movimiento
function saveMovement() {
    const type = document.getElementById('movement-type').value;
    const medicationId = parseInt(document.getElementById('movement-medication').value);
    const quantity = parseInt(document.getElementById('movement-quantity').value);
    const date = document.getElementById('movement-date').value;
    const reason = document.getElementById('movement-reason').value;
    
    // Validaciones
    if (!type || !medicationId || !quantity || !date || !reason) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
    }
    
    if (quantity <= 0) {
        showNotification('La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) {
        showNotification('Medicamento no encontrado', 'error');
        return;
    }
    
    // Validar stock para salidas
    if (type === 'salida' && medication.stock < quantity) {
        showNotification('No hay suficiente stock para realizar esta salida', 'error');
        return;
    }
    
    // Crear movimiento
    const movement = {
        id: Date.now(),
        medicationId,
        type,
        quantity,
        date,
        reason,
        user: 'Administrador' // En una app real, esto vendría de la sesión
    };
    
    // Actualizar stock del medicamento
    if (type === 'entrada') {
        medication.stock += quantity;
    } else {
        medication.stock -= quantity;
    }
    
    // Actualizar estado del medicamento
    updateMedicationStatus(medication);
    
    // Agregar movimiento a la lista
    movements.push(movement);
    
    // Guardar en localStorage
    saveData();
    
    // Recargar datos
    loadMovementsData();
    loadInventoryData();
    loadDashboardData();
    
    // Limpiar formulario
    document.getElementById('movement-form-container').querySelector('form').reset();
    
    showNotification('Movimiento registrado correctamente', 'success');
}

// Cargar datos de kardex
function loadKardexData() {
    // Cargar select de medicamentos
    const medicationSelect = document.getElementById('kardex-medication');
    medicationSelect.innerHTML = '<option value="">Seleccione un medicamento</option>';
    
    medications.forEach(med => {
        const option = document.createElement('option');
        option.value = med.id;
        option.textContent = `${med.name} (${med.lot})`;
        medicationSelect.appendChild(option);
    });
}

// Generar kardex
function generateKardex() {
    const medicationId = parseInt(document.getElementById('kardex-medication').value);
    const dateFrom = document.getElementById('kardex-date-from').value;
    const dateTo = document.getElementById('kardex-date-to').value;
    
    if (!medicationId) {
        showNotification('Por favor seleccione un medicamento', 'error');
        return;
    }
    
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) {
        showNotification('Medicamento no encontrado', 'error');
        return;
    }
    
    // Mostrar información del medicamento
    document.getElementById('kardex-med-name').textContent = medication.name;
    document.getElementById('kardex-med-lote').textContent = medication.lot;
    document.getElementById('kardex-med-stock').textContent = medication.stock;
    document.getElementById('kardex-med-min').textContent = medication.minStock;
    document.getElementById('kardex-medication-info').style.display = 'grid';
    
    // Filtrar movimientos
    let filteredMovements = movements.filter(m => m.medicationId === medicationId);
    
    if (dateFrom) {
        filteredMovements = filteredMovements.filter(m => m.date >= dateFrom);
    }
    
    if (dateTo) {
        filteredMovements = filteredMovements.filter(m => m.date <= dateTo);
    }
    
    // Ordenar por fecha
    filteredMovements.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Generar tabla de kardex
    const tbody = document.getElementById('kardex-table');
    tbody.innerHTML = '';
    
    let balance = 0;
    
    // Agregar saldo inicial
    const initialRow = document.createElement('tr');
    initialRow.innerHTML = `
        <td>Saldo Inicial</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${balance}</td>
        <td>-</td>
    `;
    tbody.appendChild(initialRow);
    
    // Procesar movimientos
    filteredMovements.forEach(mov => {
        if (mov.type === 'entrada') {
            balance += mov.quantity;
        } else {
            balance -= mov.quantity;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(mov.date)}</td>
            <td>${mov.type === 'entrada' ? 'Entrada' : 'Salida'}</td>
            <td>${mov.type === 'entrada' ? mov.quantity : '-'}</td>
            <td>${mov.type === 'salida' ? mov.quantity : '-'}</td>
            <td>${balance}</td>
            <td>${mov.reason}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('kardex-table-container').style.display = 'block';
    showNotification('Kardex generado correctamente', 'success');
}

// Exportar kardex
function exportKardex() {
    // En una aplicación real, esto generaría un archivo PDF o Excel
    showNotification('Funcionalidad de exportación en desarrollo', 'success');
}

// Cargar datos de alertas
function loadAlertsData() {
    loadLowStockAlerts();
    loadExpirationAlerts();
}

// Cargar alertas de stock bajo
function loadLowStockAlerts() {
    const container = document.getElementById('low-stock-alerts');
    container.innerHTML = '';
    
    const lowStockMeds = medications.filter(med => {
        const threshold = med.minStock * (settings.alertPercentage / 100);
        return med.stock <= threshold;
    });
    
    if (lowStockMeds.length === 0) {
        container.innerHTML = '<p>No hay alertas de stock bajo en este momento.</p>';
        return;
    }
    
    lowStockMeds.forEach(med => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item alert-low-stock';
        alertItem.innerHTML = `
            <div class="alert-info">
                <strong>${med.name}</strong> (Lote: ${med.lot})<br>
                Stock actual: ${med.stock} | Stock mínimo: ${med.minStock}
            </div>
            <div class="alert-actions">
                <button class="btn btn-primary" data-id="${med.id}">Reponer</button>
            </div>
        `;
        container.appendChild(alertItem);
    });
}

// Cargar alertas de vencimiento
function loadExpirationAlerts() {
    const container = document.getElementById('expiration-alerts');
    container.innerHTML = '';
    
    const today = new Date();
    const alertDate = new Date();
    alertDate.setDate(today.getDate() + settings.alertDays);
    
    const expiringMeds = medications.filter(med => {
        const expDate = new Date(med.expiration);
        return expDate <= alertDate;
    });
    
    if (expiringMeds.length === 0) {
        container.innerHTML = '<p>No hay alertas de vencimiento en este momento.</p>';
        return;
    }
    
    expiringMeds.forEach(med => {
        const expDate = new Date(med.expiration);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item alert-expiration';
        alertItem.innerHTML = `
            <div class="alert-info">
                <strong>${med.name}</strong> (Lote: ${med.lot})<br>
                Vence: ${formatDate(med.expiration)} (${diffDays} días)
            </div>
            <div class="alert-actions">
                <button class="btn btn-warning" data-id="${med.id}">Revisar</button>
            </div>
        `;
        container.appendChild(alertItem);
    });
}

// Mostrar/ocultar configuración de alertas
function toggleAlertsConfig() {
    const configContainer = document.getElementById('alerts-config');
    const isVisible = configContainer.style.display !== 'none';
    
    configContainer.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        // Cargar valores actuales
        document.getElementById('alert-days-before').value = settings.alertDays;
        document.getElementById('alert-low-percentage').value = settings.alertPercentage;
    }
}

// Guardar configuración de alertas
function saveAlertsConfig() {
    const days = parseInt(document.getElementById('alert-days-before').value);
    const percentage = parseInt(document.getElementById('alert-low-percentage').value);
    
    if (isNaN(days) || days < 1) {
        showNotification('Los días deben ser un número mayor a 0', 'error');
        return;
    }
    
    if (isNaN(percentage) || percentage < 1 || percentage > 100) {
        showNotification('El porcentaje debe estar entre 1 y 100', 'error');
        return;
    }
    
    settings.alertDays = days;
    settings.alertPercentage = percentage;
    
    saveData();
    loadAlertsData();
    
    document.getElementById('alerts-config').style.display = 'none';
    showNotification('Configuración de alertas guardada', 'success');
}

// Cargar datos de reportes
function loadReportsData() {
    // Inicializar selección de reporte
    selectReportType('inventory');
}

// Seleccionar tipo de reporte
function selectReportType(type) {
    currentReportType = type;
    
    // Remover clase active de todas las opciones
    document.querySelectorAll('.report-option').forEach(opt => {
        opt.classList.remove('active');
    });
    
    // Agregar clase active a la opción seleccionada
    document.querySelector(`.report-option[data-report="${type}"]`).classList.add('active');
    
    // Mostrar parámetros específicos del reporte
    showReportParams();
}

// Mostrar parámetros del reporte
function showReportParams() {
    const paramsContainer = document.getElementById('report-params-content');
    const titleContainer = document.getElementById('report-params-title');
    
    let paramsHTML = '';
    let title = '';
    
    switch(currentReportType) {
        case 'inventory':
            title = 'Reporte de Inventario';
            paramsHTML = `
                <p>Este reporte generará un listado completo del inventario actual.</p>
                <div class="form-group">
                    <label for="report-inventory-category">Filtrar por categoría (opcional)</label>
                    <select id="report-inventory-category" class="form-control">
                        <option value="">Todas las categorías</option>
                        <option value="analgesico">Analgésico</option>
                        <option value="antibiotico">Antibiótico</option>
                        <option value="antihistaminico">Antihistamínico</option>
                        <option value="antiinflamatorio">Antiinflamatorio</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
            `;
            break;
            
        case 'movements':
            title = 'Reporte de Movimientos';
            paramsHTML = `
                <p>Este reporte generará un listado de movimientos por rango de fechas.</p>
                <div class="form-row">
                    <div class="form-group">
                        <label for="report-movements-from">Desde</label>
                        <input type="date" id="report-movements-from" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="report-movements-to">Hasta</label>
                        <input type="date" id="report-movements-to" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="report-movements-type">Tipo de movimiento (opcional)</label>
                    <select id="report-movements-type" class="form-control">
                        <option value="">Todos los tipos</option>
                        <option value="entrada">Entradas</option>
                        <option value="salida">Salidas</option>
                    </select>
                </div>
            `;
            break;
            
        case 'consumption':
            title = 'Reporte de Consumo';
            paramsHTML = `
                <p>Este reporte generará estadísticas de consumo por medicamento.</p>
                <div class="form-row">
                    <div class="form-group">
                        <label for="report-consumption-from">Desde</label>
                        <input type="date" id="report-consumption-from" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="report-consumption-to">Hasta</label>
                        <input type="date" id="report-consumption-to" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label for="report-consumption-medication">Medicamento (opcional)</label>
                    <select id="report-consumption-medication" class="form-control">
                        <option value="">Todos los medicamentos</option>
                    </select>
                </div>
            `;
            break;
            
        case 'expiration':
            title = 'Reporte de Vencimientos';
            paramsHTML = `
                <p>Este reporte generará un listado de medicamentos próximos a vencer.</p>
                <div class="form-group">
                    <label for="report-expiration-days">Días hasta el vencimiento</label>
                    <input type="number" id="report-expiration-days" class="form-control" value="30" min="1">
                    <small>Mostrar medicamentos que vencen en los próximos X días</small>
                </div>
            `;
            break;
    }
    
    titleContainer.textContent = title;
    paramsContainer.innerHTML = paramsHTML;
    document.getElementById('report-params').style.display = 'block';
}

// Generar reporte
function generateReport() {
    const resultsContainer = document.getElementById('report-results-content');
    const titleContainer = document.getElementById('report-results-title');
    
    let resultsHTML = '';
    let title = '';
    
    switch(currentReportType) {
        case 'inventory':
            title = 'Reporte de Inventario';
            resultsHTML = generateInventoryReport();
            break;
            
        case 'movements':
            title = 'Reporte de Movimientos';
            resultsHTML = generateMovementsReport();
            break;
            
        case 'consumption':
            title = 'Reporte de Consumo';
            resultsHTML = generateConsumptionReport();
            break;
            
        case 'expiration':
            title = 'Reporte de Vencimientos';
            resultsHTML = generateExpirationReport();
            break;
    }
    
    titleContainer.textContent = title;
    resultsContainer.innerHTML = resultsHTML;
    document.getElementById('report-results').style.display = 'block';
    
    showNotification('Reporte generado correctamente', 'success');
}

// Generar reporte de inventario
function generateInventoryReport() {
    const categoryFilter = document.getElementById('report-inventory-category').value;
    
    let filteredMeds = medications;
    if (categoryFilter) {
        filteredMeds = medications.filter(m => m.category === categoryFilter);
    }
    
    let html = `
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Total de medicamentos:</strong> ${filteredMeds.length}</p>
        <table>
            <thead>
                <tr>
                    <th>Medicamento</th>
                    <th>Lote</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                    <th>Estado</th>
                    <th>Vencimiento</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    filteredMeds.forEach(med => {
        html += `
            <tr>
                <td>${med.name}</td>
                <td>${med.lot}</td>
                <td>${getCategoryName(med.category)}</td>
                <td>${med.stock}</td>
                <td>${med.minStock}</td>
                <td>${getStatusText(med)}</td>
                <td>${formatDate(med.expiration)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

// Generar reporte de movimientos
function generateMovementsReport() {
    const fromDate = document.getElementById('report-movements-from').value;
    const toDate = document.getElementById('report-movements-to').value;
    const typeFilter = document.getElementById('report-movements-type').value;
    
    let filteredMovements = movements;
    
    if (fromDate) {
        filteredMovements = filteredMovements.filter(m => m.date >= fromDate);
    }
    
    if (toDate) {
        filteredMovements = filteredMovements.filter(m => m.date <= toDate);
    }
    
    if (typeFilter) {
        filteredMovements = filteredMovements.filter(m => m.type === typeFilter);
    }
    
    let html = `
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Período:</strong> ${fromDate || 'Inicio'} - ${toDate || 'Fin'}</p>
        <p><strong>Total de movimientos:</strong> ${filteredMovements.length}</p>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Medicamento</th>
                    <th>Lote</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Motivo</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    filteredMovements.forEach(mov => {
        const medication = medications.find(m => m.id === mov.medicationId);
        html += `
            <tr>
                <td>${formatDate(mov.date)}</td>
                <td>${medication ? medication.name : 'N/A'}</td>
                <td>${medication ? medication.lot : 'N/A'}</td>
                <td>${mov.type === 'entrada' ? 'Entrada' : 'Salida'}</td>
                <td>${mov.quantity}</td>
                <td>${mov.reason}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

// Generar reporte de consumo
function generateConsumptionReport() {
    // Implementación simplificada
    return '<p>Reporte de consumo en desarrollo.</p>';
}

// Generar reporte de vencimientos
function generateExpirationReport() {
    const days = parseInt(document.getElementById('report-expiration-days').value) || 30;
    
    const today = new Date();
    const alertDate = new Date();
    alertDate.setDate(today.getDate() + days);
    
    const expiringMeds = medications.filter(med => {
        const expDate = new Date(med.expiration);
        return expDate <= alertDate;
    }).sort((a, b) => new Date(a.expiration) - new Date(b.expiration));
    
    let html = `
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Medicamentos que vencen en los próximos ${days} días:</strong> ${expiringMeds.length}</p>
        <table>
            <thead>
                <tr>
                    <th>Medicamento</th>
                    <th>Lote</th>
                    <th>Stock</th>
                    <th>Vencimiento</th>
                    <th>Días restantes</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    expiringMeds.forEach(med => {
        const expDate = new Date(med.expiration);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        html += `
            <tr>
                <td>${med.name}</td>
                <td>${med.lot}</td>
                <td>${med.stock}</td>
                <td>${formatDate(med.expiration)}</td>
                <td>${diffDays}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

// Cargar datos de configuración
function loadSettingsData() {
    document.getElementById('setting-institution').value = settings.institution;
    document.getElementById('setting-department').value = settings.department;
    document.getElementById('setting-backup').value = settings.backupFrequency;
    document.getElementById('setting-language').value = settings.language;
}

// Guardar configuración
function saveSettings() {
    settings.institution = document.getElementById('setting-institution').value;
    settings.department = document.getElementById('setting-department').value;
    settings.backupFrequency = document.getElementById('setting-backup').value;
    settings.language = document.getElementById('setting-language').value;
    
    saveData();
    showNotification('Configuración guardada correctamente', 'success');
}

// Guardar medicamento
function saveMedication() {
    const name = document.getElementById('modal-name').value;
    const lot = document.getElementById('modal-lote').value;
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    const minStock = parseInt(document.getElementById('modal-min-stock').value);
    const expiration = document.getElementById('modal-expiration').value;
    const category = document.getElementById('modal-category').value;
    
    // Validaciones
    if (!name || !lot || isNaN(quantity) || isNaN(minStock) || !expiration || !category) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
    }
    
    if (quantity < 0 || minStock < 0) {
        showNotification('La cantidad y stock mínimo deben ser números positivos', 'error');
        return;
    }
    
    // Crear medicamento
    const medication = {
        id: Date.now(),
        name,
        lot,
        stock: quantity,
        minStock,
        expiration,
        category,
        status: 'success'
    };
    
    // Actualizar estado
    updateMedicationStatus(medication);
    
    // Agregar a la lista
    medications.push(medication);
    
    // Guardar en localStorage
    saveData();
    
    // Recargar datos
    loadDashboardData();
    loadInventoryData();
    loadKardexData();
    
    // Cerrar modal y limpiar formulario
    closeModal(document.getElementById('addMedicationModal'));
    document.getElementById('addMedicationModal').querySelector('form').reset();
    
    showNotification('Medicamento agregado correctamente', 'success');
}

// Editar medicamento
function editMedication(id) {
    // En una aplicación real, esto abriría un formulario de edición
    showNotification(`Editando medicamento ID: ${id}`, 'success');
}

// Eliminar medicamento
function deleteMedication(id) {
    if (confirm('¿Está seguro de que desea eliminar este medicamento?')) {
        medications = medications.filter(m => m.id !== id);
        saveData();
        loadInventoryData();
        loadDashboardData();
        showNotification('Medicamento eliminado correctamente', 'success');
    }
}

// Actualizar estado del medicamento
function updateMedicationStatus(medication) {
    if (medication.stock === 0) {
        medication.status = 'danger';
    } else if (medication.stock <= medication.minStock) {
        medication.status = 'warning';
    } else {
        medication.status = 'success';
    }
}

// Obtener texto del estado
function getStatusText(medication) {
    if (medication.stock === 0) return 'Agotado';
    if (medication.stock <= medication.minStock) return 'Bajo';
    return 'Estable';
}

// Obtener clase del estado
function getStatusClass(medication) {
    if (medication.stock === 0) return 'status-danger';
    if (medication.stock <= medication.minStock) return 'status-warning';
    return 'status-success';
}

// Obtener nombre de categoría
function getCategoryName(category) {
    const categories = {
        'analgesico': 'Analgésico',
        'antibiotico': 'Antibiótico',
        'antihistaminico': 'Antihistamínico',
        'antiinflamatorio': 'Antiinflamatorio',
        'otros': 'Otros'
    };
    
    return categories[category] || category;
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    // Configurar mensaje y tipo
    notificationText.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Mostrar notificación
    notification.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('medications', JSON.stringify(medications));
    localStorage.setItem('movements', JSON.stringify(movements));
    localStorage.setItem('settings', JSON.stringify(settings));
}

// Cargar datos específicos de página
function loadPageData(page) {
    switch(page) {
        case 'inventory':
            loadInventoryData();
            break;
        case 'movements':
            loadMovementsData();
            break;
        case 'kardex':
            loadKardexData();
            break;
        case 'alerts':
            loadAlertsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Inicializar menú responsivo
function initResponsiveMenu() {
    // Ajustar menú en carga según el tamaño de pantalla
    if (window.innerWidth < 992) {
        document.querySelector('.sidebar').classList.remove('active');
        document.querySelector('.main-content').style.marginLeft = '0';
    }
    
    // Ajustar en redimensionamiento
    window.addEventListener('resize', () => {
        if (window.innerWidth < 992) {
            document.querySelector('.sidebar').classList.remove('active');
            document.querySelector('.main-content').style.marginLeft = '0';
        } else {
            document.querySelector('.sidebar').classList.add('active');
            document.querySelector('.main-content').style.marginLeft = '250px';
        }
    });
}

// Obtener nombre legible de la página
function getPageName(pageId) {
    const pageNames = {
        'dashboard': 'Dashboard',
        'inventory': 'Inventario',
        'movements': 'Movimientos',
        'kardex': 'Kardex',
        'alerts': 'Alertas',
        'reports': 'Reportes',
        'settings': 'Configuración'
    };
    
    return pageNames[pageId] || pageId;
}

