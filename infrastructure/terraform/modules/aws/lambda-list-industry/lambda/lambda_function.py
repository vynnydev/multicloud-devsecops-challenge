import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('iot-predictive-prod-industry-machines')

def lambda_handler(event, context):
    """
    Lista todas as máquinas cadastradas na indústria
    Retorna no formato esperado pelo frontend de cadastro
    """
    
    try:
        # Scan todas as máquinas
        response = table.scan()
        items = response.get('Items', [])
        
        # Formatar para o frontend
        machines = []
        for item in items:
            machines.append({
                'machine_id': item.get('machine_id', ''),
                'machine_name': item.get('machine_name', ''),
                'model': item.get('model', ''),
                'location': item.get('location', ''),
                'manufacturer': item.get('manufacturer', 'Indústria Central'),
                'status': item.get('status', 'OPERATIONAL')
            })
        
        # Retornar array direto (como o frontend espera)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(machines)
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }