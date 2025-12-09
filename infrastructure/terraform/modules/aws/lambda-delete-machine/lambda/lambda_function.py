import json
import boto3
import os

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'iot-predictive-prod-industry-machines')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Deleta uma máquina do inventário da indústria
    
    Path: /machines/{machine_id}
    Method: DELETE
    """
    
    print(f"📦 Event: {json.dumps(event)}")
    print(f"🗄️ Table name: {TABLE_NAME}")
    
    try:
        # Pegar machine_id do path
        path_parameters = event.get('pathParameters', {})
        machine_id = path_parameters.get('machine_id') if path_parameters else None
        
        if not machine_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'machine_id is required in path'
                })
            }
        
        print(f"🗑️ Deletando máquina: {machine_id}")
        
        # Verificar se a máquina existe antes de deletar
        response = table.get_item(Key={'machine_id': machine_id})
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Machine {machine_id} not found'
                })
            }
        
        machine = response['Item']
        
        # Deletar do DynamoDB
        table.delete_item(Key={'machine_id': machine_id})
        
        print(f"✅ Máquina deletada: {machine_id}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': f'Machine {machine_id} deleted successfully',
                'deleted_machine': machine
            })
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
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