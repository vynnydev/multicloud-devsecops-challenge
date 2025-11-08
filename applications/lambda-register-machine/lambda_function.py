import json
import boto3
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('industry-machines')  # Nova tabela

def lambda_handler(event, context):
    """
    Cadastra uma máquina no inventário da indústria
    
    Body:
    {
        "machine_id": "PUMP_001",
        "machine_name": "Bomba Centrífuga",
        "model": "BC-2500",
        "location": "Zone 12",
        "manufacturer": "Indústria Central",
        "install_date": "2020-01-15"
    }
    """
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        machine_id = body.get('machine_id')
        machine_name = body.get('machine_name')
        
        if not machine_id or not machine_name:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'machine_id and machine_name are required'})
            }
        
        # Criar registro
        machine = {
            'machine_id': machine_id,
            'machine_name': machine_name,
            'model': body.get('model', ''),
            'location': body.get('location', ''),
            'manufacturer': body.get('manufacturer', ''),
            'install_date': body.get('install_date', ''),
            'status': 'OPERATIONAL',
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'updated_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        # Salvar no DynamoDB
        table.put_item(Item=machine)
        
        print(f"✅ Machine registered: {machine_id}")
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Machine registered successfully',
                'machine': machine
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }