# IMPORTS ######################################################################
import json
import os
from urllib.error import HTTPError
import openai
from flask import Flask, request
################################################################################

# GLOBAL VARIABLES #############################################################
app = Flask(__name__)  # runs the web server
openai.api_key = os.getenv("OPENAI_API_KEY")  # store API in .env file

################################################################################

# CHATBOT API ##################################################################

@app.route("/get", methods=["POST"])
def get_bot_reply():
    """Queries GPT-3 API with human message and returns AI response.

    This is a helper method that works with a script embedded in chatbot.html
    to return the GPT-3 output. First, we retrieve the current human utterance
    from human_input. Then, we submit a query to the GPT-3 API. Finally, we
    update the previous human and AI utterances and return the GPT-3
    generation as the currernt AI response.

    Returns:
        GPT-3 generation (AI response string).
    """
    # Retrieve human_input populated by getResponse script in chatbot.html.
    human_input = request.args.get("human_input")
    prompt = generate_prompt(human_input)

    # Query OpenAI API for GPT-3 generation.
    global model
    global temperature
    try:
        if model == "text-davinci-002":
            response = openai.Completion.create(
                engine=model,
                prompt=prompt,
                temperature=temperature,
                max_tokens=150,
                stop=["AI:", "Human:", "\n"],
            ).choices[0].text
        else:
            response = openai.Completion.create(
                model=model,
                prompt=prompt,
                temperature=temperature,
                max_tokens=150,
                stop=["AI:", "Human:", "\n"],
            ).choices[0].text
        is_successful = True
    except Exception as e:
        response = "ERROR: " + str(e)
        is_successful = False

    # Update global variables
    global prev_human
    prev_human = human_input
    global prev_bot
    prev_bot = response

    output = {
        "response": response,
        "success": is_successful,
    }

    return json.dumps(output)
################################################################################

# HELPER METHODS ###############################################################


def generate_prompt(human_input):
    """Generates the prompt for the GPT-3 generation.

    Args:
        human_input: the current utterance string from the user.

    Returns:
        GPT-3 prompt with the AI persona and past three turns.
    """
    global persona
    global prev_human
    global prev_bot
    return """The following is a conversation with an AI persona. The AI is {}.
    
    Human: {}
    AI: {}
    Human: {}
    AI:""".format(persona, prev_human, prev_bot, human_input)
################################################################################