const API_KEY = process.env.API_KEY
const getUserByEmail = async (email) => {
  const response = await fetch("https://helpdesk.it-openspace.ru/api/v3/users?" + new URLSearchParams({
    input_data: `{
    "list_info": {
      "sort_field": "name",
      "start_index": 1,
      "get_total_count": false,
      "search_fields": {
        "email_id": "${email}"
      }
    },
    "fields_required": [
      "employee_id",
      "first_name",
      "middle_name",
      "last_name"
    ]
  }`
  }), {
    "headers": {
      authtoken: API_KEY
    },
    "body": null,
    "method": "GET"
  });
  const responseJson = await response.json();
  return responseJson.users;
}

const getUserById = async (id) => {
  const response = await fetch(`https://helpdesk.it-openspace.ru/api/v3/users/${id}`, {
    "headers": {
      authtoken: API_KEY
    },
    "body": null,
    "method": "GET"
  });
  const responseJson = await response.json();
  return responseJson.user;
}

const getAllProblems = async () => {
  const response = await fetch("https://helpdesk.it-openspace.ru/api/v3/requests?" + new URLSearchParams({
    input_data: `{
            "list_info": {
                "row_count": "25",
                "sort_field": "id",
                "sort_order": "desc",
                "search_fields": {},
                "filter_by": {
                    "name": "Open_System"
                },
                "fields_required": [
                    "requester",
                    "created_time",
                    "dependency_status",
                    "subject",
                    "notification_status",
                    "technician",
                    "priority",
                    "due_by_time",
                    "site",
                    "is_service_request",
                    "has_notes",
                    "id",
                    "status",
                    "group",
                    "template",
                    "category",
                    "short_description",
                    "has_attachments",
                    "created_time",
                    "responded_time",
                    "completed_time",
                    "resolved_time",
                    "due_by_time",
                    "is_overdue",
                    "is_first_response_overdue",
                    "status.in_progress",
                    "status.stop_timer",
                    "is_editing_completed",
                    "first_response_due_by_time",
                    "is_fcr",
                    "onhold_scheduler.change_to_status",
                    "onhold_scheduler.scheduled_time",
                    "onhold_scheduler.held_by",
                    "editor",
                    "editing_status",
                    "is_read",
                    "unreplied_count",
                    "cancel_requested_is_pending",
                    "lifecycle"
                ],
                "get_total_count": true
            }
        }`
  }), {
    "headers": {
      authtoken: API_KEY
    },
    "body": null,
    "method": "GET"
  });
  const responseJson = await response.json();
  return responseJson.requests;
}

const getTicket = async (ticketId) => {
  const response = await fetch(`https://helpdesk.it-openspace.ru/api/v3/requests/${ticketId}`, {
    "headers": {
      authtoken: API_KEY
    },
    "body": null,
    "method": "GET"
  });

  return await response.json();
}

module.exports = {getUserByEmail, getUserById, getAllProblems, getTicket}
