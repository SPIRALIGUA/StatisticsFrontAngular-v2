import { Component } from '@angular/core';
import * as XLSX from 'xlsx'; // npm install xlsx
import { ConfirmService } from '@app/shared/shared-utils/message.component'; 
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { SeedingPlanService } from '@app/service/seeding-plan.service'; 


@Component({
  selector: 'app-carnation-tool',
  templateUrl: './carnation-tool.component.html',
  styleUrls: ['./carnation-tool.component.css'],
  standalone: false
})

export class CarnationToolComponent  {

  isMaximized: boolean = false; // Estado para maximizar
  isMinimized: boolean = false;  // Estado para minimizar
  isClosed: boolean = false; // Estado para cerrar
  widgetStyles = {};          // Estilos del widget
  widgetContentStyles = {};      // Estilos del contenido del widget
  file_hist_curve: any;
  isLoading: boolean =true;
  expectedColumns: string[] = ['Distancia_Cosecha','id_farm', 'id_product', 'id_variery','Bloque','Fecha Siembra','Periodo','DIA_INICIO','DIA_FIN','SPAN','Dia','Coeficiente'];
  stringColumns: string[] = ['Periodo', 'Bloque'];
  
  constructor(
      private confirmService: ConfirmService,
      private http: HttpClient,
      private seedingPlanService: SeedingPlanService,
      private cdr: ChangeDetectorRef) { }
  // Variables para las listas desplegables
  seedingPlan_data: any[] = [];
  filteredData: any[] = [];

  // Variables para almacenar la selección actual
  selectedCountry :any []= []; //string | null = null;
  selectedFarm : any []= [];
  selectedFlower:any []= [];
  selectedVariety :any []= [];
  selectedBlock : any []= [];
  plano_s: any[] = [];


  countryNames: string[] = []; // Lista de países
  farmNames: string[] = []; // Lista de fincas
  flowerNames: string[] = []; // Lista de flores
  varietyNames: string[] = []; // Lista de variedades
  blocks: string[] = []; // Lista de bloques

  filtrosSeleccionados = {
    pais: null,
    finca: null,
    producto: null,
    variedad: null,
    bloque: null
};
    

    ngOnInit(): void {
     this.loadSeedingPlanData();
      
    }
    
    LoadCurve():void{
      this.isLoading = true
      this.seedingPlanService.sendCurve().subscribe(
        (response) => {
          this.isLoading = false;
        });
    }

    loadSeedingPlanData(): void {

      this.seedingPlanService.getSeedingPlan().subscribe(
        (response) => {        
          this.seedingPlan_data = response.seedingPlan1;
          this.filteredData = [...this.seedingPlan_data];
          this.updateDropdowns();
          this.isLoading = false;
        },
        (error) => {
          this.confirmService.message({
            title: 'Error de servicio',
            message: 'Error al recibir datos del backend ' + error,
            type_message: 'error',
          });
        }
      );
     
    }
    // Actualiza las listas únicas basadas en los datos filtrados
    updateDropdowns(): void {
      this.countryNames = [...new Set(this.filteredData.map(item => item.country_name))];
      this.farmNames = [...new Set(this.filteredData.map(item => item.farm_name))];
      this.flowerNames = [...new Set(this.filteredData.map(item => item.flower_name))];
      this.varietyNames = [...new Set(this.filteredData.map(item => item.variety_name))];
      this.blocks = [...new Set(this.filteredData.map(item => item.block))];
    }


  onCountryChange(event: any): void {
    this.selectedCountry = event.target.value;
    this.filterData();


  }

  onFarmChange(event: any): void {
    this.selectedFarm = event.target.value;
    this.filterData();
 
  }

  onFlowerChange(event: any): void {
    this.selectedFlower = event.target.value;
    this.filterData();

  }

  onVarietyChange(event: any): void {
    this.selectedVariety = event.target.value;
    this.filterData();
  
  }

  onBlockChange(event: any): void {
    this.selectedBlock = event.target.value;
    this.filterData();
  
  }



  filterData(): void {
    this.filteredData = this.seedingPlan_data.filter(item => {  
      return (
        (!this.selectedCountry || item.country_name === this.selectedCountry) &&
        (!this.selectedFarm.length || item.farm_name === this.selectedFarm) &&
        (!this.selectedFlower.length || item.flower_name === this.selectedFlower) &&
        (!this.selectedVariety.length || item.variety_name === this.selectedVariety)
      );
    });
  

    this.updateDropdowns(); // Actualizar las listas únicas basadas en los datos filtrados
  }
  

  captureActiveFilters(): void {
    const activeFilters = {
      selectedCountry: this.selectedCountry,
      selectedFarm: this.selectedFarm,
      selectedFlower: this.selectedFlower,
      selectedVariety: this.selectedVariety,
      selectedBlock: this.selectedBlock

    };
  
    this.sendFiltersToBackend(activeFilters);

    
  }
  getValidationTitle(type: string): string {
    const titles: { [key: string]: string } = {
      reception: 'Errores en recepción',
      curvas_exist: 'Advertencias de CurvasH (variedades faltantes)',
      curvas_span: 'Errores de Span en CurvasH',
      curvas_numbers: 'Errores numéricos en CurvasH',
      curvas_exist_alert: 'Advertencias de CurvasH (alertas)' // puedes ajustar nombre o separar si necesitas
    };
    return titles[type] || `Errores en ${type}`;
  }

  sendFiltersToBackend(filters: any): void {
    this.isLoading = true;
   
    this.seedingPlanService.sendFiltersToBackend(filters).subscribe(
      (response) => {
        this.isLoading = false;
   
        this.confirmService.message({
          title: 'Conexión exitosa con el servicio',
          message: 'Información actualizada',
          type_message: 'success'
        });
   
        // Separar errores y alertas
        const erroresReception = response.warnings?.reception  || [];
        const erroresCurvasExist = response.warnings?.curvas_exist || [];
        const erroresCurvasSpan = response.errors?.curvasH?.errors_Span || [];
        const erroresCurvasNumbers = response.errors?.curvasH?.errors_numbers || [];
        this.validationErrors = {};
   
        // ---------------- Errores ----------------
        if (erroresCurvasSpan.length > 0) {
          this.validationErrors['curvas_span'] = erroresCurvasSpan.map((e: any, i: number) => ({
            line: i + 1,
            error: e.mensaje + ' para la llave ' + e.farm_name + '_' + e.flower_name + '_' + e.variety_name + '_' + e.block + '_' + e.sowing_date,
            details: e
          }));
        }
   
        if (erroresCurvasNumbers.length > 0) {
          this.validationErrors['curvas_numbers'] = erroresCurvasNumbers.map((e: any, i: number) => ({
            line: i + 1,
            error: e
          }));
        }
        // Mostrar modal de errores si hay errores críticos
        if (Object.keys(this.validationErrors).length > 0 &&
          Object.values(this.validationErrors).some((lista: any[]) => lista.length > 0)) {
          this.errorModalMessage = 'Se encontraron errores en la validación.';
          this.isErrorModalVisible = true;
        }
        // ---------------- Alertas ----------------
        this.alertModalMessage = '';

        if (erroresCurvasExist.length > 0) {
          this.alertModalMessage += erroresCurvasExist.map((mensaje: string) => `⚠️ ${mensaje}`).join('<br>') + '<br>';
        }

        if (erroresReception.length > 0) {
          this.alertModalMessage += erroresReception.map((mensaje: string) => `⚠️ ${mensaje}`).join('<br>') + '<br>';
        }

        // Mostrar modal si hay al menos una alerta
        if (this.alertModalMessage.trim() !== '') {
          this.isAlertModalVisible = true;
        }
      },
   
      (error) => {
        this.isLoading = false;
        this.confirmService.message({
          title: 'Error de servicio',
          message: 'Error al enviar filtros: ' + error.message,
          type_message: 'error'
        });
      }
    );
  }
  
  
  toggleMaximize(event: Event): void {
    event.preventDefault();
    this.isMaximized = !this.isMaximized;
}



  toggleMinimize(event: Event): void {
    event.preventDefault();
    this.isMinimized = !this.isMinimized;
    
    // Ocultar o mostrar el contenido del widget
    this.widgetContentStyles = this.isMinimized ? { display: 'none' } : { display: 'block' };
  }

  closeWidget(event: Event): void {
    event.preventDefault();
    this.isClosed = true;  // Cambia el estado a cerrado
  }


onFileSelectClick() {
  // Disparar el input file programáticamente
  
  const fileInput = document.getElementById('fileInput') as HTMLElement;
  if (fileInput) {
    fileInput.click();
  }
}
// seleccionar archivo local

trackById(index: number, item: any): any {
  return item; // O una propiedad única como item.id si está disponible
}

onFileSelected(event: Event) {
  this.isLoading = true; // Inicia la carga

  const input = event.target as HTMLInputElement;
  
  if (!input.files || input.files.length === 0) {
    this.isLoading = false; // Si se cancela, restablecer el estado
    this.confirmService.message({ 
      title: 'Sin archivo!', 
      message: 'No se seleccionó ningún archivo.', 
      type_message: 'warning' 
    });
    return;
  }

  const file = input.files[0];  
  const fileName = file.name;

  // Validar que es un archivo de Excel
  const allowedExtensions = /(\.xls|\.xlsx)$/i;
  if (!allowedExtensions.exec(fileName)) {
    this.isLoading = false;
    this.confirmService.message({ 
      title: 'Archivo no válido', 
      message: 'Por favor, sube un archivo de Excel válido (.xls o .xlsx)', 
      type_message: 'error' 
    });
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e: any) => {
    try {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.file_hist_curve = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (this.file_hist_curve && this.file_hist_curve.length > 0) {
        const fileColumns = this.file_hist_curve[0];
        const columnsValid = this.validateColumns(fileColumns);
        const dataValid = columnsValid && this.validateDataTypes(this.file_hist_curve);

        if (dataValid) {
          this.confirmService.message({ 
            title: 'Registro Correcto!', 
            message: 'El archivo fue cargado y almacenado correctamente.', 
            type_message: 'success' 
          });
        } else {
          this.confirmService.message({ 
            title: 'Error en las columnas o en los tipos de datos.', 
            message: 'Asegúrate de que las columnas existen y que los datos sean válidos. ' + this.expectedColumns.join(', '), 
            type_message: 'error' 
          });
        }
      } else {
        this.confirmService.message({ 
          title: 'Registro Fallido!', 
          message: "Error al procesar el archivo.", 
          type_message: 'error' 
        });
      }
    } catch (error) {
      this.confirmService.message({ 
        title: 'Error!', 
        message: 'Ocurrió un error al leer el archivo.', 
        type_message: 'error' 
      });
    } finally {
      this.isLoading = false; // Asegurar que se restablezca
    }
  };

  reader.readAsArrayBuffer(file);
  input.value = ''; // Limpiar el input para futuras selecciones
}


  // Función para validar las columnas del archivo
  validateColumns(fileColumns: any[]): boolean {
    // Verificamos que las columnas del archivo coincidan con las esperadas
    if (fileColumns.length !== this.expectedColumns.length) {
      return false;  // Si el número de columnas no coincide
    }

    for (let i = 0; i < this.expectedColumns.length; i++) {
      if (fileColumns[i] !== this.expectedColumns[i]) {
        return false;  // Si el nombre de alguna columna no coincide
      }
    }
    return true;  // Si todas las columnas coinciden
  }

  validateDataTypes(data: any[][]): boolean {
    // Iterar sobre cada fila, ignorando la primera que son los nombres de las columnas
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
  
      for (let j = 0; j < this.expectedColumns.length; j++) {
        const columnName = this.expectedColumns[j];
        const cellValue = row[j];
  
        if (this.stringColumns.includes(columnName)) {
          // Verificar que los valores de "Periodo" y "Bloque" sean strings
          if (typeof cellValue !== 'string') {

            this.confirmService.message({ title:  'Error los tipos de datos.', 
              message: `La columna ${columnName} debe ser string. Valor encontrado: ${cellValue}`,
              type_message: 'error' });

            return false;
          }
        } else {
          // Verificar que las otras columnas sean numéricas
          if (typeof cellValue !== 'number' || isNaN(cellValue)) {
            this.confirmService.message({ title:  'Error los tipos de datos.', 
              message: ` La columna ${columnName} debe ser numérica. Valor encontrado: ${cellValue}`,
              type_message: 'error' });          
            return false;
          }
        }
      }
    }
    return true;
  }

  // Propiedad para controlar la visibilidad del modal de error
isErrorModalVisible: boolean = false;
modalType: 'error' | 'alert' | 'info' | 'success' | 'confirm' | 'process' = 'error';
modalColor: string = '#FF0000';
modalTitle: string = '';
modalMessage: string = '';
modalContext: string = '';
validationErrors: { [key: string]: { line: number, error: string }[] } = {};
objectKeys = Object.keys;
isAlertModalVisible: boolean = false; 
errorModalMessage: string = '';
alertModalMessage: string = '';
 
// Método para cerrar el modal de errores
closeErrorModal(): void {
  this.isErrorModalVisible = false;
}

// Método para cerrar el modal de alertas
closeAlertModal(): void {
  this.isAlertModalVisible = false;
}



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

}