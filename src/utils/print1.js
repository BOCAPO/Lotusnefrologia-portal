import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function printHistoryChats(registersHistory) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const reportTitle = [
    {
      text: 'Relatório de Histórico de Atendimento On Line',
      fontSize: 18,
      alignment: 'center',
      margin: [0, 0, 0, 10],
      bold: true
    }
  ];

  const data = registersHistory.map((register) => {
    return [
      {
        text: register.patientName.toUpperCase(),
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      {
        text: register.cpf,
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      {
        text: register.Date,
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      {
        text: register.Time,
        fontSize: 9,
        alignment: 'center',
        margin: [0, 1, 0, 1]
      },
      {
        text: register.roomName,
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      {
        text: register.attendantName,
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      {
        text: register.unitName,
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      }
    ];
  });

  const details = [
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: [
          [
            { text: 'Nome', style: `tableHeader`, alignment: 'center' },
            { text: 'CPF', style: `tableHeader`, alignment: 'center' },
            { text: 'Data', style: `tableHeader`, alignment: 'center' },
            { text: 'Hora', style: `tableHeader`, alignment: 'center' },
            { text: 'Fila', style: `tableHeader`, alignment: 'center' },
            { text: 'Analista', style: `tableHeader`, alignment: 'center' },
            { text: 'Unidade', style: `tableHeader`, alignment: 'center' }
          ],
          ...data
        ]
      },
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex % 2 === 0 ? '#CCCCCC' : null;
        }
      }
    }
  ];

  function Footer(currentPage, pageCount) {
    return {
      columns: [
        {
          text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
          alignment: 'right',
          fontSize: 10,
          bold: true
        },
        {
          text: 'Relatório de Histórico de Atendimento On Line',
          alignment: 'center',
          fontSize: 10,
          bold: true
        },
        {
          text: 'Data: ' + new Date().toLocaleDateString(),
          alignment: 'left',
          fontSize: 10,
          bold: true
        }
      ],
      margin: [0, 20, 0, 0]
    };
  }

  var docDefinitios = {
    pagiSize: 'A4',
    pageMargins: [30, 60, 30, 60],
    header: reportTitle,
    content: details,
    footer: Footer
  };

  pdfMake.createPdf(docDefinitios).open();
}

export default printHistoryChats;
