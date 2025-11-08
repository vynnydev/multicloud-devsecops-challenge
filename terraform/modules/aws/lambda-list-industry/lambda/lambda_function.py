import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('industry-machines')

def lambda_handler(event, context):
    """
    Lista todas as máquinas cadastradas na indústria
    
    Query params:
    - status: OPERATIONAL, MAINTENANCE, OFFLINE
    - location: filtrar por localização
    """
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        
        # Scan todas as máquinas
        response = table.scan()
        items = response.get('Items', [])
        
        # Filtrar por status se fornecido
        status_filter = params.get('status')
        if status_filter:
            items = [m for m in items if m.get('status') == status_filter]
        
        # Filtrar por location se fornecido
        location_filter = params.get('location')
        if location_filter:
            items = [m for m in items if m.get('location') == location_filter]
        
        # Ordenar por nome
        items_sorted = sorted(items, key=lambda x: x.get('machine_name', ''))
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'count': len(items_sorted),
                'machines': items_sorted
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }