const { sendContactFormEmails } = require("../../services/mailService");

const processContactMessage = async (data) => {
    return await sendContactFormEmails(data);
};

module.exports = {
    processContactMessage
};
