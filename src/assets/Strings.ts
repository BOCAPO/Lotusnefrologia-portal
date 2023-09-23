export const Strings = {
  entry: 'Entrar',
  loginRequired: 'Digite o CPF',
  passwordRequired: 'Digite a senha',
  login: 'CPF',
  password: 'Senha',
  schemaValidationCpfCnpj: 'CPF inválido.',
  forgotPassord: 'Esqueci a senha?',
  buttonLogin: 'Entrar',
  falhaRequest: 'Serviço indisponível no momento. Tente novamente mais tarde',
  headersHistory: [
    'Nome',
    'CPF',
    'Data',
    'Hora',
    'Especialista',
    'Especialidade',
    'Unidade',
    'Status'
  ],
  headersHistoryResponse: [
    'patient',
    'cpf',
    'newDate',
    'newTime',
    'specialist_name',
    'specialty',
    'unit',
    'appointment_status'
  ],
  headersUnits: ['CNPJ', 'Nome', 'Telefone', 'E-mail', 'CEP', 'Endereço'],
  headersUnitsResponse: [
    'cnpj',
    'name',
    'phone_primary',
    'email',
    'zip_code',
    'street'
  ],
  headersUsers: ['Nome', 'CPF', 'Telefone', 'E-mail', 'Status'],
  headersUsersResponse: [
    'name',
    'cpf',
    'phone_primary',
    'email',
    'profile',
    'status'
  ],
  headersSpecialist: [
    'Nome',
    'CPF',
    'Telefone',
    'E-mail',
    'Especialidade',
    'Status'
  ],
  headersSpecialistResponse: [
    'name',
    'cpf',
    'phone_primary',
    'email',
    'specialties',
    'status'
  ],
  headersPatient: ['Nome', 'CPF', 'Nascimento', 'Telefone', 'E-mail', 'Status'],
  headersPatientsResponse: [
    'name',
    'cpf',
    'birthday',
    'phone_primary',
    'email',
    'status'
  ],
  headersNewRole: ['Description', 'Status'],
  headersScale: ['Especialista', 'Unidade'],
  headersSpecialty: ['Descrição', 'Status'],
  headersProducts: ['Descrição', 'Status'],
  headersDishes: ['Nome', 'Status'],
  headersScaleResponse: ['name', 'unit'],
  headersExams: [
    'Data',
    'Nome do Paciente',
    'Especialista',
    'Tipo de Exame',
    'Anexo',
    ''
  ],
  headersExamsResponse: [
    'date',
    'patientName',
    'specialistName',
    'exam_type',
    'attachment',
    'actions'
  ],
  headersInvoice: ['Numero', 'Fornecedor', 'Emissão', 'Valor', 'Unidade'],
  headersInvoiceResponse: ['number', 'supplier', 'date', 'amount', 'unit_name'],
  schedule: 'Agendamento',
  insertNewInvoice: 'Cadastrar Nota Fiscal',
  description: 'Descrição',
  descriptionOfProduct: 'Descrição do Produto',
  pacient: 'Paciente',
  speciality: 'Especialidade',
  pluralSpeciality: 'Especialidades',
  specialist: 'Especialista',
  date: 'Data',
  hour: 'Hora',
  initialHour: 'Hora Inicial',
  finalHour: 'Hora Final',
  observation: 'Observação',
  descriptionRequired: 'Descrição é obrigatório',
  pacientRequired: 'Paciente é obrigatório',
  specialityRequired: 'Especialidade é obrigatório',
  specialistRequired: 'Especialista é obrigatório',
  dateRequired: 'Data é obrigatório',
  hourRequired: 'Hora é obrigatório',
  save: 'Salvar',
  cancel: 'Cancelar',
  edit: 'Editar',
  goBack: 'Voltar',
  print: 'Imprimir',
  insertUnit: 'Cadastrar Unidade',
  insertUser: 'Cadastrar Usuário',
  insertSpecialist: 'Cadastrar Especialista',
  insertProduct: 'Cadastro de Produtos',
  insertInvoice: 'Cadastro de Notas Fiscais',
  updateSpecialist: 'Atualizar Especialista',
  updateUnit: 'Atualizar Unidade',
  updatePatient: 'Atualizar Paciente',
  updateSpecialty: 'Atualizar Especialidade',
  updateRole: 'Atualizar Perfil',
  insertPatient: 'Cadastrar Paciente',
  insertSpecialty: 'Cadastrar Especialidade',
  insertRole: 'Cadastrar Perfil',
  editUnit: 'Editar Unidade',
  viewDataUser: 'Dados do Usuário',
  myData: 'Meus Dados',
  search: 'Pesquisar',
  scheduleConfirmation: 'Confirmação de Agenda',
  selectSpecialist: 'Selecione o Especialista',
  schemaRequiredInitialHour: 'Hora inicial é obrigatório',
  schemaRequiredFinalHour: 'Hora final é obrigatório',
  schemaRequiredInterval: 'Intervalo é obrigatório',
  interval: 'Intervalo',
  timeOfAttendance: ['15 minutos', '30 minutos', '45 minutos', '1 hora'],
  placeholderCNJP: 'Digite o CNPJ somente números',
  labelCNPJ: 'CNPJ',
  placeholderCPF: 'Digite o CPF sem pontos e traços',
  labelCPF: 'CPF',
  placeholderName: 'Nome Completo',
  labelName: 'Nome',
  placeholderResponsable: 'Responsável pela unidade',
  labelResponsable: 'Responsável',
  placeholderProfile: 'Perfil',
  placeholderPhonePrimary: 'Telefone Principal',
  placeholderPhoneSecondary: 'Telefone Secundário',
  labelPhone: 'Telefone',
  placeholderLatitude: 'Latitude',
  placeholderLongitude: 'Longitude',
  labelLatitude: 'Latitude',
  labelBirthDate: 'Data de Nascimento',
  labelLongitude: 'Longitude',
  placeholderEmail: 'E-mail',
  labelEmail: 'E-mail',
  placeholderZipCode: 'CEP',
  labelZipCode: 'CEP',
  placeholderStreet: 'Logradouro',
  labelStreet: 'Logradouro',
  placeholderBlock: 'Quadra',
  labelBlock: 'Quadra',
  placeholderLot: 'Lote',
  labelLot: 'Lote',
  placeholderNumber: 'Número',
  labelNumber: 'Número',
  placeholderNeighborhood: 'Bairro',
  labelNeighborhood: 'Bairro',
  placeholderCity: 'Cidade',
  labelCity: 'Cidade',
  placeholderState: 'Estado',
  labelState: 'Estado',
  placeholderComplement: 'Complemento (Opcional)',
  labelComplement: 'Complemento',
  placeholderLinkFacebook: 'Link do Facebook',
  labelLinkFacebook: 'Link do Facebook',
  placeholderLinkInstagram: 'Link do Instagram',
  labelLinkInstagram: 'Link do Instagram',
  placeholderLinkSite: 'Link do Site',
  labelLinkSite: 'Link do Site',
  schemaRequiredCnpj: 'CNPJ é obrigatório',
  schemaNameRequired: 'Nome é obrigatório',
  schemaResponsibleRequired: 'Responsável é obrigatório',
  schemaEmailRequired: 'E-mail é obrigatório',
  schemaStateRequired: 'Estado é obrigatório',
  schemaCityRequired: 'Cidade é obrigatório',
  schemaPhonePrimaryRequired: 'Telefone Principal é obrigatório',
  schemaLatitudeRequired: 'Latitude é obrigatório',
  schemaLongitudeRequired: 'Longitude é obrigatório',
  schemaZipCodeRequired: 'CEP é obrigatório',
  schemaStreetRequired: 'Logradouro é obrigatório',
  schemaNumberRequired: 'Número é obrigatório',
  confirmation: 'Confirmação',
  whatDoYouWantToDo: 'O que você deseja fazer?',
  close: 'Fechar',
  messageSuccessInsertUnit: 'O cadastro da unidade foi realizada com sucesso.',
  messageSuccessInsertUser: 'O cadastro do usuário foi realizada com sucesso.',
  messageSuccessInsertSpecialist:
    'O cadastro do especialista foi realizada com sucesso.',
  messageSuccessInsertPatient:
    'O cadastro do paciente foi realizada com sucesso.',
  messageSuccessInsertScaleSchedule:
    'O cadastro da escala foi realizada com sucesso.',
  messageSuccessInsertSpecialty:
    'O cadastro da especialidade foi realizado com sucesso.',
  messageSuccessInsertRole: 'O cadastro do perfil foi realizado com sucesso.',
  messageSuccessUpdateUnit: 'O cadastro da unidade foi atualizado com sucesso.',
  messageSuccessUpdateUser: 'O cadastro do usuário foi atualizado com sucesso.',
  messageSuccessUpdateSpecialist:
    'O cadastro do especialista foi atualizado com sucesso.',
  messageSuccessUpdatePatient:
    'O cadastro do paciente foi atualizado com sucesso.',
  messageSuccessUpdateSpecialty:
    'O cadastro da especialidade foi atualizado com sucesso.',
  messageSuccessUpdateRole: 'O cadastro do perfil foi atualizado com sucesso.',
  messageSuccessInsertProduct:
    'O cadastro do produto foi realizado com sucesso.',
  messageSuccessInsertDishe: 'O cadastro do prato foi realizado com sucesso.',
  messageSuccessUpdateProduct:
    'O cadastro do produto foi atualizado com sucesso.',
  messageSuccesUpdateDishe: 'O cadastro do prato foi atualizado com sucesso.',
  messageSuccessDeleteProduct:
    'O cadastro do produto foi excluído com sucesso.',
  messageSuccessDeleteDishe: 'O cadastro do prato foi excluído com sucesso.',
  selectDate: 'Selecione a data',
  hoursDisponibles: 'Horários disponíveis',
  resetPasswordSpecialist: 'Redefinir Senha do Especialista',
  resetPasswordUser: 'Redefinir Senha do Usuário',
  resetPasswordPatient: 'Redefinir Senha do Paciente',
  status: 'Status',
  linkedUnits: 'Unidades Vinculadas',
  headersResponseNewSpecialties: ['description', 'status'],
  headersResponseNewProducts: ['description', 'status'],
  headersResponseNewDished: ['name', 'status'],
  erase: 'Excluir',
  notInformed: 'Não Informado',
  unit: 'Unidade',
  appointmentsConfirmed: 'Consultas confirmadas',
  appointmentsDetailts: 'Detalhes do Agendamento',
  placeholderPatient: 'Paciente',
  labelPatient: 'Paciente',
  placeholderDate: 'Data',
  labelDate: 'Data',
  placeholderHour: 'Horário',
  labelHour: 'Horário',
  aprove: 'Aprovar',
  change: 'Alterar',
  delete: 'Excluir',
  makeAppointment: 'Realizar Agendamento',
  noAppointmentsScheduled: 'Não há agendamentos agendados',
  noAppointmentsPendent: 'Não há agendamentos Pendentes',
  noAppointmentsConfirmed: 'Não há agendamentos Confirmados',
  noAppointmentsCanceled: 'Não há agendamentos Cancelados',
  clear: 'Limpar',
  insertExam: 'Cadastrar Exame',
  type: 'Tipo',
  import: 'Importar',
  selectOrDropFile: 'Selecione ou arraste o arquivo',
  noOneFileSelected: 'Nenhum arquivo selecionado',
  typesFilesAcceptedExams: 'Tipos de arquivos aceitos: pdf, jpg, jpeg, png',
  typesFilesAccpetedDishe: 'Extensões aceitas: jpg, jpeg, png',
  appointmentConfirmed: 'Consulta foi confirmada com sucesso!',
  appointmentCanceled: 'Consulta foi cancelada com sucesso!',
  appointmentChanged: 'Consulta foi reagendada com sucesso!',
  supplier: 'Fornecedor',
  invoice: 'Nota Fiscal',
  series: 'Série',
  amountTotal: 'Valor Total',
  amountDiscount: 'Valor Desconto',
  product: 'Produto',
  quantity: 'QTDE',
  typeOfUnity: 'UN',
  items: 'Itens',
  valueUnit: 'Vl. Unit. (R$)',
  new: 'Novo',
  nameOfDishe: 'Nome do Prato',
  disheCategory: 'Categoria do Prato',
  typeOfDishe: 'Tipo do Prato',
  kitcheOrders: 'Pedidos da Cozinha'
};
