import json
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('machines-status')

def lambda_handler(event, context):
    """
    Lista máquinas que foram enviadas para análise/manutenção
    
    Query params opcionais:
    - status: ACTIVE, MAINTENANCE, CRITICAL
    - limit: número de resultados (default: 50)
    """
    
    try:
        # Parse query parameters
        params = event.get('queryStringParameters', {}) or {}
        status_filter = params.get('status')
        limit = int(params.get('limit', 50))
        
        # Scan table (para demo - em produção usar Query com index)
        scan_kwargs = {
            'Limit': limit
        }
        
        if status_filter:
            scan_kwargs['FilterExpression'] = Key('status').eq(status_filter)
        
        response = table.scan(**scan_kwargs)
        items = response.get('Items', [])
        
        # Ordenar por timestamp (mais recentes primeiro)
        items_sorted = sorted(
            items,
            key=lambda x: x.get('timestamp', ''),
            reverse=True
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'count': len(items_sorted),
                'machines': items_sorted
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }