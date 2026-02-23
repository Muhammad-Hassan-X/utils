 /**
 * CONFIGURATION
 * Paste your n8n webhook URL below
 */
const url = "paste webhook code";

/**
 * Main trigger function
 * This runs automatically when form is submitted
 */
function onFormSubmit(e) {
  try {
    if (!e || !e.response) {
      Logger.log("No event data found.");
      return;
    }

    const response = e.response;
    const itemResponses = response.getItemResponses();

    // Convert form responses into an object
    let formData = {};

    itemResponses.forEach(function(item) {
      const question = item.getItem().getTitle();
      const answer = item.getResponse();
      formData[question] = answer;
    });

    // Add metadata (optional but useful)
    formData.submittedAt = new Date().toISOString();
    formData.responseId = response.getId();

    // Send to n8n webhook
    sendToWebhook(formData);

  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error);
  }
}

/**
 * Reusable function to send data to webhook
 */
function sendToWebhook(data) {
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log("Webhook response: " + response.getContentText());
}