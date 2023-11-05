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
        text:
          register.sender_type.toUpperCase() === 'SYSTEM'
            ? 'SISTEMA'
            : register.sender_type.toUpperCase() === 'PATIENT'
            ? 'PACIENTE'
            : 'ATENDENTE',
        fontSize: 9,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      {
        text: register.message,
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
            { text: 'Usuário', style: `tableHeader`, alignment: 'center' },
            { text: 'Mensagem', style: `tableHeader`, alignment: 'center' }
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

  const FooterBody = {
    columns: [
      {
        text: 'Página {{currentPage}} de {{pageCount}}',
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

  function Footer(currentPage, pageCount) {
    return {
      ...Footer,
      columns: FooterBody.columns.map((column) => ({
        ...column,
        text: column.text
          .replace('{{currentPage}}', currentPage.toString())
          .replace('{{pageCount}}', pageCount.toString())
      }))
    };
  }

  const docDefinitios = {
    pagiSize: 'A4',
    pageMargins: [30, 60, 30, 60],
    header: reportTitle,
    content: details,
    footer: Footer
  };

  pdfMake.createPdf(docDefinitios).open();
}

export default printHistoryChats;
