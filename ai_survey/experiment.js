const createSurveyQuestions = (questions) => {
  const firstObj = {
    type: "html",
    prompt:
      "<h2>Indicate the extent to which you agree with the following statements.</h2>",
    name: "Indicate the extent to which you agree with the following statements.",
  };

  var surveyQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    var questionObj = {
      type: "likert",
      likert_scale_values: [
        { value: 1, text: "Strongly Disagree", label: "likert_scale_1_label" },
        {
          value: 2,
          text: "Somewhat Disagree",
          label: "likert_scale_2_label",
        },
        {
          value: 3,
          text: "Equally Disagree/Agree",
          label: "likert_scale_3_label",
        },
        { value: 4, text: "Somewhat Agree", label: "likert_scale_4_label" },
        { value: 5, text: "Strongly Agree", label: "likert_scale_5_label" },
      ],
      prompt: `${questions[i]}`,
      name: `${questions[i]}`,
      required: true,
    };
    surveyQuestions.push(questionObj);
  }

  function chunkArray(array, chunkSize, prependedObj) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      let chunk = array.slice(i, i + chunkSize);
      chunk.unshift(prependedObj); // Add the object to the start of each chunk
      result.push(chunk);
    }
    return result;
  }

  // this won't chunk the array b/c questions.length, but keeping in case we want to split up questions into different pages
  var preparedQuestionArray = chunkArray(
    surveyQuestions,
    questions.length,
    firstObj
  );

  return preparedQuestionArray;
};

var questions = [
  "I trust artificial intelligence.",
  "AI is making our daily lives easier.",
  "I trust companies that do not use AI over companies that do.",
  "I would prefer to drive a self-driving car over a regular car.",
  "I trust a self driving car to drive safer than I would normally.",
  "I believe that increased use of artificial intelligence will make the world a safer place.",
  "More vehicles, software, and appliances should make use of AI.",
];

var surveyQuestions = createSurveyQuestions(questions);

var instructions = [
  `<div class='instructions'>
      <p>Welcome to this survey.</p>
      <p>Please answer the following questions about Artificial Intelligence.</p>
      <p>Press <b>enter</b> to begin.</p>
  </div>`,
];

var instructionsBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "instructions",
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: instructions,
  choices: ["Enter"],
  post_trial_gap: 0,
};

var trial = {
  type: jsPsychSurvey,
  pages: surveyQuestions,
  button_label_finish: "Submit",
  on_finish: function (data) {
    if (
      "Please answer the following questions about Artificial Intelligence." in
      data.response
    ) {
      delete data.response[
        "Please answer the following questions about Artificial Intelligence."
      ];
    }
    data.likert_scale_1_label = "Strongly Disagree";
    data.likert_scale_2_label = "Somewhat Disagree";
    data.likert_scale_3_label = "Equally Disagree/Agree";
    data.likert_scale_4_label = "Somewhat Agree";
    data.likert_scale_5_label = "Strongly Agree";
  },
};

var postTaskQuestion =
  "Do you have any comments, concerns, or issues pertaining to this survey?";

var postTaskBlock = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: `<h1 class=block-text>${postTaskQuestion}</h1>`,
      name: postTaskQuestion,
      required: false,
      rows: 20,
      columns: 80,
    },
  ],
  response_ends_trial: true,
  data: {
    trial_id: "post_task_feedback",
  },
  on_finish: function (data) {
    data.question = postTaskQuestion;
    data.response = data.response[postTaskQuestion];
  },
};

var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};
var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "end",
    exp_id: "demographics_survey_rdoc",
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ["Enter"],
  post_trial_gap: 0,
};

ai_survey_experiment = [];
var ai_survey_init = () => {
  ai_survey_experiment.push(fullscreen);
  ai_survey_experiment.push(instructionsBlock);
  ai_survey_experiment.push(trial);
  ai_survey_experiment.push(postTaskBlock);
  ai_survey_experiment.push(endBlock);
  ai_survey_experiment.push(exitFullscreen);
};
