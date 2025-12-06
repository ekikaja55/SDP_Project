const prisma = require("../../prisma/prisma");

const createLog = async ({
  actor,
  type,
  action,
  title,
  desc
}) => {
  try {
    await prisma.log.create({
      data: {
        log_actor: actor,
        log_type: type,
        log_action: action,
        log_title: title,
        log_desc: desc,
      },
    });
    console.log(`Sukses Insert log ${type} ke db`);
  } catch (error) {
    console.error("Kena error di create log: ", error.message);
  }
};

module.exports = {
  createLog,
};
