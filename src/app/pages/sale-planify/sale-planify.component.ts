import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { SeedingPlanService } from '@app/service/seeding-plan.service';
import { ConfirmService } from '@app/shared/shared-utils/message.component';
import { SettingsService } from '@app/core/settings/settings.service';

@Component({
  selector: 'app-sale-planify',
  templateUrl: './sale-planify.component.html',
  styleUrls: ['./sale-planify.component.css'],
  standalone: false
})
export class SalePlanifyComponent {
  // Propiedades para el estado de la ventana
  isMinimized: boolean = false;
  isMaximized: boolean = false;
  // Objetos para almacenar archivos cargados y datos procesados
  uploadedFiles: { [key: string]: File } = {};
  processedData: { [key: string]: any[] } = {};
  isLoading: boolean =false;
  validationErrors: { [key: string]: { line: number, error: string }[] } = {};
  // Propiedad para almacenar la semana ingresada para el empalme
  empalmeWeek: string = '';

  // Propiedad para marcar archivos como subidos
  fileUploaded: { [key: string]: boolean } = {};
  userName: string = ''; // Variable para almacenar el nombre del usuario
  isDropdownOpen: boolean = false;
  selectedProcess: string | undefined;
  isProcessModalVisible: boolean = false;
  isStatusModalVisible: boolean = false;
  processId: string = '';
  isConsultModalVisible: boolean = false;
  processStatus: string = "";
  processMessage: string = "";
  showDownload: boolean = false;
  insumos: string[] = [
    'requerimiento', 'cargar curvas', 'cargar disp fincas', 'cargar relación curva sem',
    'cargar restricciones', 'orden de asignacion', 'prioridades', 'prioridadad por semana', 'programa actual'
  ];
  executedProcesses: { processId: string, name: string }[] = [];
  selectedProcessId: string | undefined;

  constructor(
    private confirmService: ConfirmService,
    private seedingPlanService: SeedingPlanService,
    private settingsService: SettingsService
  ) {
    this.loadUserName();
  }

  private loadUserName(): void {
    this.userName = this.settingsService.getUserSetting('name') || 'Usuario desconocido';
    
  }

ngOnInit(): void {
    this.loadExecutedProcesses();
  }
  loadExecutedProcesses(): void {
    this.seedingPlanService.getExecutedProcesses().subscribe(
      (response: any) => {
        this.executedProcesses = response.processes;
      },
      (error) => {
        this.showModal('alert', 'Error', 'Error al cargar los procesos ejecutados.');
      }
    );
  }
  executeProjection(): void {
    const jsonData = this.createJsonStructure();
    this.sendDataToBackend(jsonData, 'executeProjection');
  }

  executeBudget(): void {
    const jsonData = this.createJsonStructure();
    this.sendDataToBackend(jsonData, 'executeBudget');
  }

  sendDataToBackend(jsonData: any, processType: string) {
    this.isLoading = true;

    // Construir el payload para enviar al backend
    const payload = {
      tipo: 'send_Inputs',
      processType: processType,
      Inputs: jsonData // Enviar la estructura JSON generada
    };

      this.seedingPlanService.sendInputsToBackend(payload).subscribe(
      
        (response: any) => {
         
          this.isLoading = false;

           // Obtener el ID del proceso
      this.processId = response.processId

           this.showModal('process', '');
          this.confirmService.message({
            title: 'Conexion exitosa con el servicio',
            message: `Proceso "${processType}" ejecutado correctamente.`,
            type_message: 'success'
          })
        },
        (error) => {
         
          this.confirmService.message({
            title: 'Error de servicio',
            message: 'Error en el proceso '+ error.message,
            type_message: 'error'
          });
   
        }
      );
    }
openConsultModal(): void {
  this.isConsultModalVisible = true;
}
closeStatusModal(): void {
  this.isStatusModalVisible = false;
}
 closeConsultModal(): void {
  this.isConsultModalVisible = false;
}
consultProcessStatus() {
  if (!this.selectedProcessId) {
    this.showModal('alert', 'ID Requerido', 'Por favor, ingrese un ID de proceso.');
    return;
  }
  const processIdNum = Number(this.processId);
  if (isNaN(processIdNum)) {
    this.showModal('alert', 'Error', 'El ID ingresado no es válido.');
    return;
  }

  this.seedingPlanService.getProcessStatus(processIdNum).subscribe(
    (response: { estado: string; mensaje: string; descarga: boolean }) => {
      this.processStatus = response.estado;
      this.processMessage = response.mensaje;
      this.showDownload = response.descarga || false;

      // Mostrar el modal de estado
      this.closeConsultModal();
      this.isStatusModalVisible = true;
    },
    (error: any) => {
      this.showModal('alert', 'Error', error.error?.detail || 'No se pudo consultar el estado del proceso.');
    }
      );
    }
  downloadFiles(): void {
    // Simulación de descarga de archivos
    alert("Descargando archivos...");
  }
// Método para cambiar el estado de la ventana (minimizar, maximizar, cerrar)

  toggleWindowState(state: string): void {
    const container = document.querySelector('.container') as HTMLElement;
    if (!container) return;
    switch (state) {
      case 'maximize':
        if (!this.isMaximized) {
          container.style.position = 'fixed';
          container.style.top = '0';
          container.style.left = '0';
          container.style.width = '100vw';
          container.style.height = '100vh';
          container.style.zIndex = '9999';
        } else {
          container.style.position = 'relative';
          container.style.width = '80vw';
          container.style.height = '90vh';
          container.style.zIndex = '1';
        }
        this.isMaximized = !this.isMaximized;
        break;
      case 'minimize':
        this.isMinimized = !this.isMinimized;
        container.style.height = this.isMinimized ? '50px' : '100vh';
        break;
      case 'close':
        container.style.display = 'none';
        break;
        default:
          this.showModal('alert', `Estado de ventana no reconocido: "${state}"`);
          break;
      }
  }

  isFileUploaded(fileType: string): boolean {
    return !!this.fileUploaded[fileType];
  
  }
  // Método para descargar múltiples archivos CSV en un archivo ZIP
  async downloadFormats(): Promise<void> {
    const zip = new JSZip();
  
    const filesData = [
      { name: 'Requerimiento.xlsx', headers: ['Programa', 'Producto', 'Variedad', 'Color', 'Semana', 'Tallos'] },
      { name: 'Programa actual.xlsx', headers: ['Finca', 'Producto', 'Variedad', 'Color', 'Semana', 'Fecha de siembra', 'Plantas'] },
      { name: 'Curvas.xlsx', headers: ['Finca', 'Variedad', 'Producto', 'Color', 'Apro Fin', 'Dia Inicio', 'Span', ...Array.from({ length: 365 }, (_, i) => (i + 1).toString())] },
      { name: 'Cargar disp fincas.xlsx', headers: ['Semana', 'Finca', 'Camas'] },
      { name: 'Restricciones.xlsx', headers: ['Programa', 'Producto', 'Variedad', 'Finca'] },
      { name: 'Relacion curva sem.xlsx', headers: ['Semana', 'Periodo'] },
      { name: 'Prioridades.xlsx', headers: ['Programa', 'Producto', 'Variedad', 'Finca', 'Prioridad'] },
      { name: 'Prioridad semana.xlsx', headers: ['Programa', 'Producto', 'Variedad', 'Finca', 'Semana', 'Prioridad'] },
      { name: 'Orden de asignacion.xlsx', headers: ['Finca', 'Orden'] }
    ];
  
    for (const file of filesData) {
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([file.headers]);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
      const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      zip.file(file.name, new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    }
  
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'formats.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
 
// Método para cargar un archivo y procesarlo
async uploadFile(type: string): Promise<void> {

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx';

  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    if (!file) {
      
      return; 
    }
    this.isLoading = true;
    
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'xlsx') {
        this.showModal('error', 'Solo se permiten archivos con extensión .xlsx');
        this.isLoading = false; 
        return;
      }
   
      try {
        this.uploadedFiles[type] = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Primera hoja
          const sheet = workbook.Sheets[sheetName];
        
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[];
          const parsedData: string[][] = jsonData.map(row =>
            Array.isArray(row) ? row.map(cell => String(cell)) : []
          );
          this.processedData[type] = parsedData.length > 0 ? parsedData : [];
        
          if (parsedData.length === 0) {
            this.showModal('error', 'El archivo está vacío o no contiene datos válidos.');
            this.fileUploaded[type] = false;
            this.isLoading = false;
            return;
          }
          this.validationErrors[type] = [];

          // Llama a la validación según el tipo de archivo
          switch (type) {
            case 'requerimiento':
              this.validateRequerimiento(parsedData, type);
              break;
            case 'cargar curvas':
              this.validateCurvas(parsedData, type);
              break;
            case 'cargar disp fincas':
              this.validateDispFincas(parsedData, type);
              break;
            case 'cargar relación curva sem':
              this.validateRelacionCurvaSem(parsedData, type);
              break;
            case 'cargar restricciones':
              this.validateRestricciones(parsedData, type);
              break;
            case 'orden de asignacion':
              this.validateOrdenAsignacion(parsedData, type);
              break;
            case 'prioridades':
              this.validatePrioridades(parsedData, type);
              break;
            case 'prioridadad por semana':
              this.validatePrioridadSemana(parsedData, type);
              break;
            case 'programa actual':
              this.validateProgramaActual(parsedData, type);
              break;
            default:
              this.showModal('error', 'Tipo de archivo no reconocido.');
              this.isLoading = false;
              return;
              
          }
       // Si no hay errores de validación, marcar el archivo como subido
       if (this.validationErrors[type].length === 0) {
        this.fileUploaded[type] = true;
      } else {
        this.fileUploaded[type] = false; // Asegurar que no se marque como subido si hay errores
      }
      this.isLoading = false;
    };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        this.showModal('error', 'Ocurrió un error al procesar el archivo.');
        this.fileUploaded[type] = false;
      } finally {
        this.isLoading = true;
      }
    
  };

  fileInput.click();
}
showJsonPreview(): void {
  const jsonData = this.createJsonStructure();
  this.confirmService.message({
    title: 'Previsualización del JSON',
    message: `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`,
    type_message: 'info'
  });
}

// Método para generar la estructura JSON
private createJsonStructure(): any {
  // Mapeo de cada insumo con sus encabezados esperados
  const mapping: { [key: string]: string[] } = {
    'requerimiento': ['Programa', 'Producto', 'Variedad', 'Color', 'Semana', 'Tallos'],
    'cargar curvas': [
      'Finca',
      'Variedad',
      'Producto',
      'Color',
      'Apro Fin',
      'Dia Inicio',
      'Span',
      ...Array.from({ length: 365 }, (_, i) => (i + 1).toString())
    ],
    'cargar disp fincas': ['Semana', 'Finca', 'Camas'],
    'cargar relación curva sem': ['Semana', 'Periodo'],
    'cargar restricciones': ['Programa', 'Producto', 'Variedad', 'Finca'],
    'orden de asignacion': ['Finca', 'Orden'],
    'prioridades': ['Programa', 'Producto', 'Variedad', 'Finca', 'Prioridad'],
    'prioridadad por semana': ['Programa', 'Producto', 'Variedad', 'Finca', 'Semana', 'Prioridad'],
    'programa actual': ['Finca', 'Producto', 'Variedad', 'Color', 'Semana', 'Fecha de siembra', 'Plantas']
  };

  let jsonStructure: any = {
    user: this.userName,
    processType: this.selectedProcess,
    insumos: {}
  };
  this.insumos.forEach(insumo => {
    const expectedHeaders = mapping[insumo] || [];
    const dataArray = this.processedData[insumo];

    if (dataArray && dataArray.length > 0) {
      const rows = dataArray.slice(1);
      const objects = rows.map(row => {
        let obj: any = {};

        expectedHeaders.forEach((header, index) => {
          // Se asigna el valor en la posición index, o "" si está indefinido
          let cellValue = row[index] ?? "";

          // Solo para cargar curvas si la columna es numérica ("1" a "365") y el valor está vacío, poner "0"
          if (
            insumo === "cargar curvas" &&
            /^[1-9]\d{0,2}$/.test(header) && 
            (cellValue === "" || cellValue === undefined)
          ) {
            cellValue = "0";
          }

          obj[header] = cellValue;
        });

        return obj;
      });

      jsonStructure.insumos[insumo] = objects;
    } else {
      // Si no hay datos cargados, se genera un dataframe vacío con las columnas esperadas
      const emptyRow = expectedHeaders.reduce((acc, header) => {
        if (
          insumo === "cargar curvas" &&
          /^[1-9]\d{0,2}$/.test(header)
        ) {
          acc[header] = "0";
        } else {
          acc[header] = "";
        }
        return acc;
      }, {} as any);
      jsonStructure.insumos[insumo] = expectedHeaders.length > 0 ? [emptyRow] : [];
    }
  });

  return jsonStructure;
}

toggleDropdown(): void {
  this.isDropdownOpen = !this.isDropdownOpen;
}
//selecciona el tipo de proceso y cierra el menú desplegable
onProcessSelection(processType: string): void {
  this.selectedProcess = processType;
  this.isDropdownOpen = false;
}
// Ejecuta el proceso seleccionado
executeSelectedProcess(): void {
  if (!this.selectedProcess) {
    this.confirmService.message({
      title: 'Selección requerida',
      message: 'Por favor, seleccione un tipo de proceso antes de ejecutar.',
      type_message: 'error'
    });
    return;
  }
  const jsonData = this.createJsonStructure();
    this.sendDataToBackend(jsonData, this.selectedProcess);
  
}

// Método para copiar el ID del proceso
copyProcessId(): void {
  navigator.clipboard.writeText(this.processId).then(() => {
  });
}
// Método para validar el formato requerimiento
validateRequerimiento(data: string[][], type: string): void {
 
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Programa', 'Producto', 'Variedad', 'Color', 'Semana', 'Tallos'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
  const keys = new Set();
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [programa, producto, variedad, color, semana, tallos] = row.map((cell) => this.cleanData(cell));
 
    if (!programa || !producto || !variedad || !color || !semana || !tallos) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    if (!/^\d+$/.test(semana)) {
      errors.push({ line, error: 'Semana debe ser un número entero' });
    }
    if (!/^\d+(\.\d+)?$/.test(tallos) || parseFloat(tallos) < 0) {
      errors.push({ line, error: 'Tallos debe ser un numero entero mayor o igual a 0' });
    }
    const key = `${programa}-${producto}-${variedad}-${color}-${semana}`;
    if (keys.has(key)) {
      errors.push({ line, error: 'Llave duplicada detectada' });
    } else {
      keys.add(key);
    }
  });
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
 
}
 
// Método para validar el formato de curvas
 
validateCurvas(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Finca', 'Variedad', 'Producto', 'Color', 'Apro Fin', 'Dia Inicio', 'Span'];
  for (let i = 1; i <= 365; i++) {
    expectedHeaders.push(i.toString());
  }
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
  const keys = new Set();
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [finca, variedad, producto, color, aproFin, diaInicio, span, ...days] = row.map((cell) => this.cleanData(cell));
    if (!finca || !variedad || !producto || !color || !aproFin || !diaInicio || !span) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    if (isNaN(parseFloat(aproFin))) {
      errors.push({ line, error: 'Apro Fin debe ser un número decimal' });
    }
    if (!/^\d+$/.test(diaInicio) || !/^\d+$/.test(span)) {
      errors.push({ line, error: 'Dia Inicio y Span deben ser números enteros' });
    }
    const key = `${finca}-${variedad}-${producto}-${color}`;
    if (keys.has(key)) {
      errors.push({ line, error: 'Llave duplicada detectada' });
    } else {
      keys.add(key);
    }
    // Reemplazar comas por puntos decimales y luego convertir a número
    const decimalPrecision = 5; // Ajusta según sea necesario
    const roundedDays = days.map(day => parseFloat(parseFloat(day.replace(',', '.') || '0').toFixed(decimalPrecision)));
    const daySum = roundedDays.reduce((sum, day) => sum + day, 0);
    if (Math.abs(daySum - 1) > 0.0001) { // Ajustar la tolerancia
      errors.push({ line, error: `Los coeficientes de los días deben sumar 1. Suma actual: ${daySum.toFixed(decimalPrecision)}` });
    }
  });
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato de disponibilidad de fincas
 
validateDispFincas(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Semana', 'Finca', 'Camas'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
  const keys = new Set();
  const semanas: number[] = [];
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [semana, finca, camas] = row.map((cell) => this.cleanData(cell));
    if (!semana || !finca || !camas) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    if (!/^\d+$/.test(semana)) {
      errors.push({ line, error: 'Semana debe ser un número entero' });
    } else {
      semanas.push(parseInt(semana));
    }
    if (!/^\d+$/.test(camas) || parseInt(camas) < 0) {
      errors.push({ line, error: 'Camas debe ser un número entero mayor o igual a 0' });
    }
    const key = `${semana}-${finca}`;
    if (keys.has(key)) {
      errors.push({ line, error: 'Llave duplicada detectada' });
    } else {
      keys.add(key);
    }
  });
 
  // Verificar que las semanas sean consecutivas
  semanas.sort((a, b) => a - b);
  for (let i = 1; i < semanas.length; i++) {
    if (semanas[i] !== semanas[i - 1] + 1) {
      errors.push({ line: i + 1, error: 'Las semanas no son consecutivas' });
    }
  }
 
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato de programa actual
 
validateProgramaActual(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Finca', 'Producto', 'Variedad', 'Color', 'Semana', 'Fecha de siembra', 'Plantas'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
  const groupedData: Record<string, number> = {};
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [finca, producto, variedad, color, semana, fechaSiembra, plantas] = row.map((cell) => this.cleanData(cell));
    if (!finca || !producto || !variedad || !color || !semana || !fechaSiembra || !plantas) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    if (!/^[0-9]+$/.test(semana)) {
      errors.push({ line, error: 'Semana debe ser un número entero' });
    }
    const parsedDate = new Date(fechaSiembra);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ line, error: 'Fecha de siembra no es válida' });
    } else {
      const formattedDate = `${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getDate().toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
      if (formattedDate !== fechaSiembra) {
        errors.push({ line, error: 'Fecha de siembra debe tener formato MM/DD/YYYY' });
      }
    }
    if (!/^[0-9]*\.?[0-9]+$/.test(plantas) || parseFloat(plantas) < 0) {
      errors.push({ line, error: 'Plantas debe ser un número decimal mayor a 0' });
    }
    const key = `${finca}-${producto}-${variedad}-${color}-${fechaSiembra}`;
    if (!groupedData[key]) {
      groupedData[key] = 0;
    }
    groupedData[key] += parseFloat(plantas);
  });
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato relacion curva semana
 
validateRelacionCurvaSem(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Semana', 'Periodo'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
  const weeks = new Set();
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [semana, periodo] = row.map((cell) => this.cleanData(cell));
    if (!semana || !periodo) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    if (!/^\d+$/.test(semana)) {
      errors.push({ line, error: 'Semana debe ser un número entero' });
    }
    if (weeks.has(semana)) {
      errors.push({ line, error: 'Semana duplicada detectada' });
    } else {
      weeks.add(semana);
    }
  });
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato de restricciones
 
validateRestricciones(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Programa', 'Producto', 'Variedad', 'Finca'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
  const keys = new Set();
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [programa, producto, variedad, finca] = row.map((cell) => this.cleanData(cell));
    if (!programa || !producto || !variedad || !finca) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    const key = `${programa}-${producto}-${variedad}-${finca}`;
    if (keys.has(key)) {
      errors.push({ line, error: 'Llave duplicada detectada' });
    } else {
      keys.add(key);
    }
  });
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato de orden de asignacion
 
validateOrdenAsignacion(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Finca', 'Orden'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
 
  const fincaSet = new Set<string>();
  const ordenes: number[] = [];
 
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
    const [finca, orden] = row.map((cell) => this.cleanData(cell));
    if (!finca || !orden) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    }
    if (!/^\d+$/.test(orden)) {
      errors.push({ line, error: 'Orden debe ser un número entero' });
    } else {
      const ordenNumber = parseInt(orden, 10);
      ordenes.push(ordenNumber);
      if (fincaSet.has(finca)) {
        errors.push({ line, error: 'Finca duplicada detectada' });
      } else {
        fincaSet.add(finca);
      }
    }
  });
 
  // Ordenar los valores de Orden y verificar consecutividad
  ordenes.sort((a, b) => a - b);
  for (let i = 0; i < ordenes.length - 1; i++) {
    if (ordenes[i + 1] !== ordenes[i] + 1) {
      errors.push({ line: i + 2, error: 'El orden de asignación no es consecutivo' });
    }
  }
 
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato de prioridades
validatePrioridades(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Programa', 'Producto', 'Variedad', 'Finca', 'Prioridad'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
 
  const keyPriorityMap = new Map<
    string,
    { priorities: { prioridad: number; line: number }[], fincaMap: Map<string, number> }
  >();
 
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
 
    const [programa, producto, variedad, finca, prioridadStr] = row.map((cell) => this.cleanData(cell));
 
    if (!programa || !producto || !variedad || !finca || !prioridadStr) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    } else if (!/^[0-9]+$/.test(prioridadStr) || parseInt(prioridadStr, 10) <= 0) {
      errors.push({ line, error: 'La prioridad debe ser un número entero mayor a 0' });
    } else {
      const prioridad = parseInt(prioridadStr, 10);
      const key = `${programa}-${producto}-${variedad}`;
 
      if (!keyPriorityMap.has(key)) {
        keyPriorityMap.set(key, { priorities: [], fincaMap: new Map() });
      }
 
      const entry = keyPriorityMap.get(key)!;
 
      // Verificar conflictos de prioridad por finca
      if (entry.fincaMap.has(finca)) {
        const existingPriority = entry.fincaMap.get(finca)!;
        if (existingPriority !== prioridad) {
          errors.push({
            line,
            error: `La finca "${finca}" tiene una prioridad conflictiva.`,
          });
        }
      } else {
        entry.fincaMap.set(finca, prioridad);
      }
 
      entry.fincaMap.forEach((value, keyFinca) => {
        if (keyFinca !== finca && value === prioridad) {
          errors.push({
            line,
            error: `La prioridad no debe repetirse en fincas diferentes.`,
          });
        }
      });
 
      entry.priorities.push({ prioridad, line });
    }
  });
 
  // Validación de prioridades consecutivas por llave
  keyPriorityMap.forEach(({ priorities }, key) => {
    const sortedPriorities = priorities.sort((a, b) => a.prioridad - b.prioridad);
 
    for (let i = 0; i < sortedPriorities.length; i++) {
      if (sortedPriorities[i].prioridad !== i + 1) {
        errors.push({
          line: sortedPriorities[i].line,
          error: `Las prioridades no son consecutivas`,
        });
      }
    }
  });
 
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar el formato de prioridad por semana
validatePrioridadSemana(data: string[][], type: string): void {
  const errors: { line: number; error: string }[] = [];
  const headers = data[0];
  const expectedHeaders = ['Programa', 'Producto', 'Variedad', 'Finca', 'Semana', 'Prioridad'];
  if (!this.validateHeaders(headers, expectedHeaders)) {
    errors.push({ line: 0, error: 'Las columnas no coinciden con el formato esperado' });
  }
 
  const keyPriorityMap = new Map<
    string,
    { priorities: { prioridad: number; line: number }[], fincaMap: Map<string, number> }
  >();
 
  data.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (row.every((cell) => cell.trim() === '')) return;
 
    const [programa, producto, variedad, finca, semana, prioridadStr] = row.map((cell) => this.cleanData(cell));
 
    if (!programa || !producto || !variedad || !finca || !semana || !prioridadStr) {
      errors.push({ line, error: 'Campos vacíos detectados' });
    } else if (!/^[0-9]+$/.test(prioridadStr) || parseInt(prioridadStr, 10) <= 0) {
      errors.push({ line, error: 'La prioridad debe ser un número entero mayor a 0' });
    } else {
      const prioridad = parseInt(prioridadStr, 10);
      const key = `${programa}-${producto}-${variedad}-${semana}`;
 
      if (!keyPriorityMap.has(key)) {
        keyPriorityMap.set(key, { priorities: [], fincaMap: new Map() });
      }
 
      const entry = keyPriorityMap.get(key)!;
      if (entry.fincaMap.has(finca)) {
        const existingPriority = entry.fincaMap.get(finca)!;
        if (existingPriority !== prioridad) {
          errors.push({
            line,
            error: `La finca "${finca}" tiene una prioridad conflictiva.`,
          });
        }
      } else {
        entry.fincaMap.set(finca, prioridad);
      }
 
      entry.fincaMap.forEach((value, keyFinca) => {
        if (keyFinca !== finca && value === prioridad) {
          errors.push({
            line,
            error: `La prioridad no debe repetirse en fincas diferentes.`,
          });
        }
      });
 
      entry.priorities.push({ prioridad, line });
    }
  });
 
  keyPriorityMap.forEach(({ priorities }, key) => {
    const sortedPriorities = priorities.sort((a, b) => a.prioridad - b.prioridad);
 
    for (let i = 0; i < sortedPriorities.length; i++) {
      if (sortedPriorities[i].prioridad !== i + 1) {
        errors.push({
          line: sortedPriorities[i].line,
          error: `Las prioridades no son consecutivas`,
        });
      }
    }
  });
 
  this.processedData[type] = data;
  this.validationErrors[type] = errors;
  this.showValidationSummary(type);
}
 
// Método para validar los encabezados de un archivo cargado
validateHeaders(headers: string[], expectedHeaders: string[]): boolean {
  return (
    JSON.stringify(headers.map((h) => h.trim().toUpperCase())) ===
    JSON.stringify(expectedHeaders.map((h) => h.toUpperCase()))
  );
}
// Método para limpiar los datos cargados
cleanData(data: string): string {
  return (
    data?.trim().replace(/[\t\n\r]+/g, '').replace(/[\u0300-\u036f]/g, '').toUpperCase() || ''
  );
}
// Propiedad para controlar la visibilidad del modal de error
isErrorModalVisible: boolean = false;
modalType: 'error' | 'alert' | 'info' | 'success' | 'confirm' | 'process' = 'error';
modalColor: string = '#FF0000';
modalTitle: string = '';
modalMessage: string = '';
modalContext: string = '';
// Método para mostrar un modal con mensajes informativos, de error, éxito, etc.
showModal(type: 'error' | 'alert' | 'info' | 'success' | 'confirm' | 'process', message: string, context?: string): void {
  const typeToColor: { [key in typeof this.modalType]: string } = {
    error: '#D73D32',
    alert: '#F29F05',
    info: '#55B3D9',
    success: '#57A641',
    confirm: '#1CA5B8',
    process: '#1CA5B8'
  };
  this.modalType = type;
  this.modalColor = typeToColor[type];
  this.modalTitle = this.getModalTitle(type);
  this.modalMessage = message;
  this.modalContext = context || '';
  this.isErrorModalVisible = true;
}
 
closeModal(): void {
  this.isErrorModalVisible = false;
}
// Método para mostrar un resumen de validación después de cargar un archivo
showValidationSummary(type: string): void {
  const errors = this.validationErrors[type] || [];
  if (errors.length === 0) {
    this.showModal('success', `El archivo ${type} fue cargado exitosamente.`);
  } else {
    this.showModal('error', `Se encontraron errores en el archivo ${type}.`, type);
  }
}
// Método privado para obtener el título del modal según el tipo
private getModalTitle(type: 'error' | 'alert' | 'info' | 'success' | 'confirm' | 'process'): string {
  const titles: { [key in 'error' | 'alert' | 'info' | 'success' | 'confirm' | 'process']: string } = {
    error: 'Error detectado!',
    alert: 'Alerta! Parámetro no admitido',
    info: 'Informativo! Aviso informativo',
    success: '¡Exitoso! El archivo ha sido cargado',
    confirm: 'Confirmación',
    process: 'Proceso en ejecución' // Nuevo título para el modal del proceso
  };
  return titles[type];
}

// Mostrar ventana de empalme
openEmpalmeModal(): void {
  const week = prompt('Seleccione la semana de inicio para empalmar (formato YYYYWW):');
  if (week && /^[0-9]{6}$/.test(week)) {
    this.empalmeWeek = week;
  } else {
    this.showModal('alert', 'Ingrese un formato válido (YYYYWW).');
  }
}
}