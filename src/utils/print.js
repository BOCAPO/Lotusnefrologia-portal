export class Print {
  constructor(dadosParaImpressao) {
    this.dadosParaImpressao = dadosParaImpressao;
  }

  async PreparaDocumento() {
    const corpoDocumento = this.CriaCorpoDocumento();
    const documento = this.GerarDocumento(corpoDocumento);
    return documento;
  }

  CriarCorpoDocumento() {
    const header = [
      { text: 'Nome', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'CPF', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Data', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Hora', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Fila', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Analista', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Unidade', bold: true, fontSize: 9, margin: [0, 4, 0, 0] }
    ];
    const body = this.dadosParaImpressao((registro) => {
      return [
        { text: registro.patientName, fontSize: 8 },
        { text: registro.cpf, fontSize: 8 },
        { text: registro.Date, fontSize: 8 },
        { text: registro.Time, fontSize: 8 },
        { text: registro.roomName, fontSize: 8 },
        { text: registro.attendantName, fontSize: 8 },
        { text: registro.unitName, fontSize: 8 }
      ];
    });

    const lineHeader = [
      {
        text: '________________________________________________________________',
        alignment: 'center',
        fontSize: 5,
        colSpan: 7
      },
      {},
      {},
      {},
      {},
      {},
      {}
    ];

    let content = [header, lineHeader];
    content = [...content, ...body];
    return content;
  }

  GerarDocumento(corpoDocumento) {
    const documento = {
      //   pageSize: 'A4',
      //   pageMargins: [20, 20, 20, 20],
      //   header: function () {
      //     return {
      //       text: 'Relatório de Atendimento',
      //       alignment: 'center',
      //       fontSize: 9,
      //       margin: [0, 10, 0, 0]
      //     };
      //   },
      content: [
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: corpoDocumento
          }
        }
      ]
      //   footer: function (currentPage, pageCount) {
      //     return {
      //       text: currentPage.toString() + ' de ' + pageCount,
      //       alignment: 'center',
      //       fontSize: 9,
      //       margin: [0, 10, 0, 0]
      //     };
      //   },
      //   styles: {
      //     reportName: {
      //       fontSize: 18,
      //       bold: true,
      //       alignment: 'center',
      //       margin: [0, 0, 0, 10]
      //     }
      //   }
    };
    return documento;
  }
}
