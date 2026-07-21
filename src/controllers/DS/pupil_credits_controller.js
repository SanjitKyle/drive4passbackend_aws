const pupil_credits = require('../../models/DS/pupil_credits.model');
const { createCreditLog } = require('./pupil_credits_log.controller');

exports.createPupilCredits = async (obj, session) => {
  const { pupil_id, credits, reference, school_id, user } = obj;

  if (!pupil_id || credits === undefined || !reference || !school_id || !user) {
    return {
      success: false,
      message: 'pupil_id, credits, reference, school_id and user are required'
    };
  }

  const creditValue = Number(credits);
  if (isNaN(creditValue)) {
    return { success: false, message: 'credits must be a valid number' };
  }

  const existing = await pupil_credits
    .findOne({ pupil_id })
    .session(session);

  if (existing && existing.credits + creditValue < 0) {
    return { success: false, message: 'Insufficient credits' };
  }

  const updatedCredits = await pupil_credits.findOneAndUpdate(
    { pupil_id },
    {
      $inc: { credits: creditValue },
      $set: { school_id, last_updated_by: user },
    },
    { new: true, upsert: true, session }
  );

  const logResult = await createCreditLog({
    school_id,
    pupil_id,
    credit_hours: creditValue,
    reference,
    created_by: user,
  }, session);

  if (!logResult.success) return logResult;

  return { success: true, data: updatedCredits };
};


exports.getPupil = async (req, res, next) => {
  try {
    const pupil_id = req.params.id;
    const school_id=req.user.school_id

    if (!pupil_id) {
      return res.status(400).json({
        success: false,
        message: 'No pupil id provided',
      });
    }

    const pupilCredits = await pupil_credits.findOne({ pupil_id ,school_id});

    if (!pupilCredits) {
      return res.status(404).json({
        success: false,
        message: 'Could not find pupil credits with provided id',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully got pupil credits',
      data: pupilCredits,
    });

  } catch (error) {
    console.error('error', error);
    next(error);
  }
};
