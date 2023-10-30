/*eslint quotes: ["error", "backtick"]*/
// Bacticks are enforcedf in this file so that special characters are correctly rendered.
/* Language defaults */
const enGb = {
  generalTime: {
    months: [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`],
    daysInFull: [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`],
    daysTruncated: [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`]
  },
  pluralism: `s`,
  formatDayText: {
    textBefore: `Set these times for all`,
    textAfter: ``
  },
  timeWidget: {
    addTime: `Add time:`,
    start: `Start`,
    end: `End`
  }
};

/* Language defaults */
const ptPt = {
  generalTime: {
    months: [`Janeiro`, `Fevereiro`, `Março`, `Abril`, `Maio`, `Junho`, `Julho`, `Agosto`, `Setembro`, `Outubro`, `Novembro`, `Dezembro`],
    daysInFull: [`Domingo`, `Segunda-Feira`, `Terça-Feira`, `Quarta-Feira`, `Quinta-Feira`, `Sexta-Feira`, `Sábado`],
    daysTruncated: [`Dom`, `Seg`, `Ter`, `Qua`, `Qui`, `Sex`, `Sab`]
  },
  pluralism: `s`,
  formatDayText: {
    textBefore: `Applique estas horas a`,
    textAfter: ``
  },
  timeWidget: {
    addTime: `Adicione duração:`,
    start:`Início`,
    end: `Fim`
  }

};

const languages = { enGb, ptPt };

export { languages };
