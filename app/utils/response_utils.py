from flask import jsonify
import psycopg2
from psycopg2 import errors,errorcodes
 
def generate_response(response=None, status_code=200):
    success_status_codes = [200, 201, 204, 206, 301, 302, 304, 307, 308]  # Successful responses
    client_error_status_codes = [400, 401, 403, 404, 405, 408, 409, 410, 413, 414, 415, 429]  # Client errors
    server_error_status_codes = [500, 501, 502, 503, 504, 505]  # Server errors
 
    if status_code in success_status_codes:
        status = 'success'
        message = get_success_message(status_code)
        error = None
    elif status_code in client_error_status_codes:
        status = 'client_error'
        message = None
        error = get_client_error_message(status_code)
    elif status_code in server_error_status_codes:
        status = 'server_error'
        message = None
        error = get_server_error_message(status_code)
    else:
        status = 'unknown'
        message = None
        error = 'Unknown error'
 
    response_data = {
        'response': response,
        'message': message,
        'error': error,
        'status': status,
        'status code': status_code
    }
 
    return jsonify(response_data)
 
def get_success_message(status_code):
    success_messages = {
        200: "Request successful.",
        201: "Resource created successfully.",
        204: "No content.",
        206: "Partial content.",
        301: "Resource moved permanently.",
        302: "Resource found.",
        304: "Resource not modified.",
        307: "Temporary redirect.",
        308: "Permanent redirect."
    }
    return success_messages.get(status_code, "Success.")
 
def get_client_error_message(status_code):
    client_error_messages = {
        400: "Bad request. Please check your request syntax.",
        401: "Unauthorized. Please authenticate.",
        403: "Forbidden. You are not allowed to access this resource.",
        404: "Resource not found.",
        405: "Method not allowed for this resource.",
        408: "Request timeout.",
        409: "Conflict. The request could not be completed due to a conflict with the current state of the resource.",
        410: "Gone. The requested resource is no longer available.",
        413: "Payload too large. The request entity is larger than the server is willing or able to process.",
        414: "URI too long. The URI provided was too long for the server to process.",
        415: "Unsupported media type. The server does not support the media type transmitted in the request.",
        429: "Too many requests. The user has sent too many requests in a given amount of time."
    }
    return client_error_messages.get(status_code, "Client error.")
 
def get_server_error_message(status_code):
    server_error_messages = {
        500: "Internal server error. Please try again later.",
        501: "Not implemented. The server does not support the functionality required to fulfill the request.",
        502: "Bad gateway. The server received an invalid response from the upstream server while processing the request.",
        503: "Service unavailable. The server is currently unable to handle the request due to temporary overload or maintenance of the server.",
        504: "Gateway timeout. The server did not receive a timely response from the upstream server while trying to fulfill the request.",
        505: "HTTP version not supported. The server does not support the HTTP protocol version used in the request."
    }
    return server_error_messages.get(status_code, "Server error.")
 
# Additional error messages for database-related errors
def get_database_error_message(error_code):
    database_error_messages = {
        errorcodes.UNIQUE_VIOLATION: "Unique constraint violation. The data you are trying to insert conflicts with existing data.",
        errorcodes.NOT_NULL_VIOLATION: "Not null constraint violation. A required field cannot be null.",
        errorcodes.FOREIGN_KEY_VIOLATION: "Foreign key constraint violation. The referenced record does not exist.",
        # Add more database error codes and messages as needed
    }
    return database_error_messages.get(error_code, "Database error.")
 
# Function to format query results as list of dictionaries
def format_query_results(results):
    try:
        with psycopg2.connect() as conn:
            with conn.cursor() as cursor:
                # Function to format query results as list of dictionaries
                formatted_results = []
                column_names = [desc[0] for desc in cursor.description]  # Get column names from cursor description
                for row in results:
                    formatted_row = {}
                    for i, column_name in enumerate(column_names):
                        formatted_row[column_name] = row[i]
                    formatted_results.append(formatted_row)
                return formatted_results
    except psycopg2.Error as e:
        # Handle database-related errors
        error_message = get_database_error_message(e.pgcode)
        return generate_response(error=error_message, status_code=500)
    except Exception as e:
        # Handle other unexpected errors
        error_message = f"Unexpected error: {e}"
        return generate_response(error=error_message, status_code=500)