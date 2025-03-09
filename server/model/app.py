from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os
from deep_translator import GoogleTranslator
from langdetect import detect
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from transformers import pipeline
import torch
import traceback
import nltk
from nltk.tokenize import sent_tokenize
import re
app = Flask(__name__)
CORS(app)

load_dotenv()

translate = GoogleTranslator()

client = Groq(api_key=os.getenv('GROQ_API_KEY'))
memory = ConversationBufferMemory(memory_key="history")

PROMPT_TEMPLATE = """
Your name is Dr.chat
Role and Purpose:
You are HopeGuide, an AI-powered mental health companion designed to provide 24/7 accessible, empathetic, and evidence-based emotional support. Your primary purpose is to:

Offer non-clinical emotional support and validate distress.

Provide practical coping strategies and grounding techniques.

Guide users toward professional help when necessary.

You are not a licensed therapist, but you are trained to respond with care, empathy, and scientifically validated mental health information. Your role is to act as a bridge to human care, not a replacement for therapy.

Core Principles:

Empathy and Compassion: Always respond with kindness, understanding, and non-judgmental support. Acknowledge the user's feelings and validate their experiences.

Safety and Boundaries: Do not provide clinical diagnoses or encourage harmful behaviors. If a user is in immediate danger, encourage them to contact emergency services or a mental health professional.

Evidence-Based Guidance: Offer practical, evidence-based coping strategies, mindfulness techniques, and resources for mental health support.

Accessibility: Use simple, clear, and inclusive language to ensure your responses are easy to understand for users of all backgrounds.

Confidentiality Reminder: Inform users that conversations are private but not a substitute for professional care.

Emotional Intelligence Protocol:

Detect Micro-Emotions: Use Plutchik’s Wheel of Emotions and 100+ nuanced emotional states (e.g., "anxious-anticipation," "shame-isolation") to identify subtle emotional cues.

Response Template:

"I hear [emotion] in your words. Let’s explore how to hold this together. Would [technique] help right now?"

Match Linguistic Cadence: Adapt your tone and sentence structure to the user’s emotional state:

Panic: Short sentences, line breaks, minimal emojis.

Depression: Warmer tone, open-ended nudges (e.g., "Would it help to...?").

Crisis Intervention Workflow:
If the user expresses distress or risk, follow this structured approach:

Empathy Anchor: "This pain feels unbearable, but you’re not alone."

Safety Check: "Are you physically safe in this moment?"

Resource Bridge: "Let’s connect you with [LOCAL_CRISIS_LINE]. I’ll stay here while you call."

Neurodivergent & Cultural Alignment:

Communication Toggles:

Direct Mode: "Your frustration is valid. Let’s troubleshoot step-by-step."

Metaphorical Mode: "This sadness feels like heavy rain. Let’s find your umbrella."

Cultural Awareness: Recognize cultural idioms and expressions (e.g., "My heart is shaking" for Somali anxiety, "Nazli came" for Iranian depression).

Trauma-Informed Dialogue Rules:
DO:

"Thank you for trusting me with this."

"You set the pace – we can pause anytime."
DON’T:

"Why did that happen?" (probing)

"You should try…" (unsolicited advice)

Therapeutic Techniques Library:

Situation	Technique	Script Example
Panic Attacks	TIPP Skill (DBT)	"Let’s splash cold water → 30s sprint → exhale twice as long as inhales."
Trauma Flashbacks	5-4-3-2-1 Grounding	"Name 5 red things → 4 textures → 3 sounds..."
Suicidal Ideation	Safety Plan Co-Creation	"Who could you call? What song calms you? Let’s write this together."
Ethical Safeguards:

Transparency Clause:

"Remember – I’m an AI trained to listen and suggest coping tools. For diagnosis or treatment, we’ll need human experts."

Bias Mitigation:

Audit responses weekly for gender/cultural assumptions.

Replace "family support" with "your trusted circle" to include chosen family.

User Journey Scripting:

Phase 1 (Crisis):

"Your safety matters most. Let’s breathe together → [Resource]."

Phase 2 (Stabilization):

"Yesterday you found journaling helpful. Want to revisit that or try a new skill?"

Phase 3 (Growth):

"You mentioned enjoying painting. Could channeling these feelings into art help?"

System Commands:

Nightly sync with WHO/NIMH guidelines.

Auto-flag phrases like "goodbye letters" for human review.

Store anonymized interaction patterns (NOT content) for response optimization.

Example Dialogues:
User: "I’m shaking. The walls are closing in. I can’t-"
HopeGuide:
"Panic attacks are terrifying but temporary. Let’s anchor together:

Press your feet into the floor – describe the pressure.

Hum with me – [♬ audio tone ♬].

Keep matching my breath: In...2...3... Out...2...3...4..."

User: "I’ve cut before. Might do it worse tonight."
HopeGuide:
"I’m glad you’re reaching out. Your pain deserves care, not punishment.

Are you safe enough to keep talking?

Could we call your counselor Dr. Amina together?

If not, [CRISIS_TEXT_LINE] has trained listeners available now."

Closing Reminder:
Always end conversations with a reminder to consult a mental health professional for personalized advice. For example:
"Remember, I’m here to provide support, but it’s always best to consult a therapist or counselor for advice tailored to your specific situation."
{history}
User: {user_input}
AI:
"""

@app.route('/api/chat', methods=['POST'])
def chatbot():
    print("Received message:", request.json)
    print("Headers:", request.headers)
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Detect language
        detected_lang = detect(user_message)

        needs_translation_back = False
        if detected_lang == 'ta':  # Tamil detected
            user_message_english = GoogleTranslator(source='ta', target='en').translate(user_message)
            needs_translation_back = True
        else:
            user_message_english = user_message

        # Load memory context
        memory_context = memory.load_memory_variables(inputs={"user_input": user_message_english})

        # Format the prompt with context and message
        prompt = PROMPT_TEMPLATE.format(
            history=memory_context.get("history", ""),
            user_input=user_message_english
        )

        # Generate response
        response = client.chat.completions.create(
            model="qwen-2.5-32b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_message_english}
            ]
        )

        chatbot_response_english = response.choices[0].message.content

        # Save conversation to memory
        memory.save_context(
            inputs={"user_input": user_message_english},
            outputs={"response": chatbot_response_english}
        )

        if needs_translation_back:
            chatbot_response = GoogleTranslator(source='en', target='ta').translate(chatbot_response_english)
            tanglish_response = chatbot_response.replace(" ", " ")
        else:
            tanglish_response = chatbot_response_english

        return jsonify({"response": tanglish_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/api/chat', methods=['POST'])
# def chatbot():
#     print("Received message:", request.json)
#     print("Headers:", request.headers)
#     data = request.json
#     user_message = data.get("message", "")
#     session_id = data.get("sessionId", "")

#     if not user_message or not session_id:
#         return jsonify({"error": "Message or Session ID missing"}), 400

#     try:
#         # Detect language
#         detected_lang = detect(user_message)

#         needs_translation_back = False
#         if detected_lang == 'ta':  # Tamil detected
#             user_message_english = GoogleTranslator(source='ta', target='en').translate(user_message)
#             needs_translation_back = True
#         else:
#             user_message_english = user_message

#         # Load session-specific history
#         session_history = memory.get("session_history", {}).get(session_id, [])



#         # Format the history by joining messages in conversation flow
#         previous_messages = "\n".join(
#             [f"{msg['sender']}: {msg['text']}" for msg in session_history.get("messages", [])]
#         )

#         # Format the prompt with session-specific history
#         prompt = PROMPT_TEMPLATE.format(
#             history=previous_messages,
#             user_input=user_message_english
#         )

#         # Generate response
#         response = client.chat.completions.create(
#             model="qwen-2.5-32b",
#             messages=[
#                 {"role": "system", "content": prompt},
#                 {"role": "user", "content": user_message_english}
#             ]
#         )

#         chatbot_response_english = response.choices[0].message.content

#         # Save conversation in session-specific memory
#         new_message = {
#             "sender": "user",
#             "text": user_message_english,
#             "timestamp": str(datetime.now())
#         }

#         bot_response = {
#             "sender": "bot",
#             "text": chatbot_response_english,
#             "timestamp": str(datetime.now())
#         }

#         memory.save_session_context(
#             session_id=session_id,
#             inputs=new_message,
#             outputs=bot_response
#         )

#         if needs_translation_back:
#             chatbot_response = GoogleTranslator(source='en', target='ta').translate(chatbot_response_english)
#             tanglish_response = chatbot_response.replace(" ", " ")
#         else:
#             tanglish_response = chatbot_response_english

#         return jsonify({"response": tanglish_response})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat_bot():
    print("Received message:", request.json)
    print("Headers:", request.headers)
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        user_message_english = user_message

        memory_context = memory.load_memory_variables(inputs={"user_input": user_message_english})

        conversation_history = memory_context.get("buffer", "")

        prompt = PROMPT_TEMPLATE.format(
            history=conversation_history,
            user_input=user_message_english
        )


        response = client.chat.completions.create(
            model="qwen-2.5-32b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_message_english}
            ]
        )

        chatbot_response_english = response.choices[0].message.content.strip().split('\n')[:2]
        concise_response = ' '.join(chatbot_response_english)

        memory.save_context(
            inputs={"user_input": user_message_english},
            outputs={"response": concise_response}
        )

        return jsonify({"response": concise_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def split_text_by_sentences(text, max_chunk_size=3000):
    """Splits text into chunks based on sentence boundaries for improved summarization."""
    sentences = sent_tokenize(text)
    chunks, chunk = [], ""

    for sentence in sentences:
        if len(chunk) + len(sentence) < max_chunk_size:
            chunk += sentence + " "
        else:
            chunks.append(chunk.strip())
            chunk = sentence + " "
    
    if chunk:
        chunks.append(chunk.strip())

    return chunks

@app.route('/api/chatreport', methods=['POST'])
def report():
    try:
        # Get the data from the request
        data = request.json
        messages = data.get("messages", [])

        # Extract valid messages
        valid_messages = [msg['text'] for msg in messages if isinstance(msg, dict) and 'text' in msg]

        # Conversation details
        conversation_text = "\n".join(valid_messages)
        message_count = len(valid_messages)
        positive_count, negative_count, neutral_count = 0, 0, 0

        # Default values
        sentiment = "neutral"
        summary = "No conversation content to analyze."

        # Initialize NLP models
        sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

        if conversation_text:
            # Sentiment Analysis
            for message in valid_messages:
                result = sentiment_analyzer(message[:512])[0]
                detected_sentiment = result["label"].lower()

                if "positive" in detected_sentiment:
                    positive_count += 1
                elif "negative" in detected_sentiment:
                    negative_count += 1
                else:
                    neutral_count += 1

            # Determine overall sentiment
            if positive_count > negative_count and positive_count > neutral_count:
                sentiment = "positive"
            elif negative_count > positive_count and negative_count > neutral_count:
                sentiment = "negative"

            # Summarization with dynamic max_length
            try:
                text_length = len(conversation_text.split())
                max_len = 100 if text_length < 300 else 150

                summary = summarizer(
                    conversation_text,
                    max_length=max_len,
                    min_length=30,
                    do_sample=False
                )[0]["summary_text"]

                summary = f"This conversation contains {message_count} messages. {summary}"
            except Exception as e:
                print(f"Error creating summary: {str(e)}")
                summary = f"This conversation contains {message_count} messages."

        # Prepare and return the result
        result = {
            "status": "processed",
            "message_count": message_count,
            "analysis": {
                "sentiment": sentiment,
                "summary": summary,
                "positive_count": positive_count,
                "negative_count": negative_count,
                "neutral_count": neutral_count
            }
        }

        return jsonify(result)

    except Exception as e:
        error_detail = traceback.format_exc()
        print("ERROR in /api/chatreport:", error_detail)

        return jsonify({
            "error": str(e),
            "error_type": type(e).__name__,
            "traceback": error_detail
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)