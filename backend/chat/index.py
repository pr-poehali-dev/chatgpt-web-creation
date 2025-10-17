'''
Business: AI chat endpoint that searches Yandex and provides materialistic answers
Args: event - dict with httpMethod, body containing message and language
      context - object with request_id attribute
Returns: HTTP response with search results and answer
'''

import json
import os
import urllib.parse
import urllib.request
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    try:
        body_data = json.loads(body_str)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'}),
            'isBase64Encoded': False
        }
    
    user_message = body_data.get('message', '')
    language = body_data.get('language', 'ru')
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    search_query = urllib.parse.quote(user_message)
    search_url = f'https://yandex.ru/search/?text={search_query}'
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            html_content = response.read().decode('utf-8', errors='ignore')
        
        snippets: List[str] = []
        import re
        snippet_pattern = r'<div[^>]*class="[^"]*text[^"]*"[^>]*>([^<]+)</div>'
        matches = re.findall(snippet_pattern, html_content, re.IGNORECASE)
        snippets = [m.strip() for m in matches[:5] if len(m.strip()) > 20]
        
        if snippets:
            answer_text = snippets[0]
            ai_response = f'{answer_text}\n\n{search_url}'
        else:
            ai_response = search_url
    except Exception as search_error:
        ai_response = search_url
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'response': ai_response,
            'request_id': context.request_id
        }),
        'isBase64Encoded': False
    }