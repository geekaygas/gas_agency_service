import React, { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import ClientDetailsModal from "./ConsumerDetailsModal";
import "../styles/ClientRow.css";

const API_URL = "https://gas-agency-service.onrender.com/api/clients";

const ClientRow = ({ client, onDelete, onUpdate }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Payment Due":
        return "status-payment-due";
      case "Suspended":
        return "status-suspended";
      default:
        return "status-default";
    }
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  const getAvatarClass = (name) => {
    const classes = [
      "avatar-blue",
      "avatar-orange",
      "avatar-purple",
      "avatar-green",
    ];
    return classes[name.length % classes.length];
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${client._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        onDelete(client._id); // remove from parent state
        setShowDeleteConfirm(false);
        setShowDetailsModal(false);
      }
       window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <tr className="client-row">
        <td>
          <div className="client-info">
            <div className={`client-avatar ${getAvatarClass(client.name)}`}>
              {getInitial(client.name)}
            </div>
            <div>
              <p className="client-name">{client.name}</p>
              <p className="client-id">ID: {client._id}</p>
            </div>
          </div>
        </td>

        <td className="hide-mobile">
          <div className="contact-info">
            <div className="contact-avatar">{client.contact.avatar}</div>
            <div>
              <p className="contact-name">{client.contact.name}</p>
              <p className="contact-email">{client.contact.email}</p>
            </div>
          </div>
        </td>

        <td className="hide-tablet">
          <div className="domain-list">
            {client.domains.slice(0, 2).map((domain, idx) => (
              <span key={idx} className="domain-badge">
                {domain}
              </span>
            ))}
            {client.domains.length > 2 && (
              <span className="domain-more">
                +{client.domains.length - 2} more
              </span>
            )}
          </div>
        </td>

        <td className="hide-desktop">
          <div className="email-usage">
            <p className="usage-text">
              {client.emailUsage.used}/{client.emailUsage.total} Users
            </p>
            <div className="usage-bar">
              <div
                className="usage-progress"
                style={{
                  width: `${
                    (client.emailUsage.used / client.emailUsage.total) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="usage-percent">
              {Math.round(
                (client.emailUsage.used / client.emailUsage.total) * 100
              )}
              %
            </p>
          </div>
        </td>

        <td>
          <span className={`status-badge ${getStatusClass(client.status)}`}>
            <span className="status-dot"></span>
            {client.status}
          </span>
        </td>

        <td className="hide-mobile">
          <div className="action-buttons">
            <button
              className="btn-view"
              onClick={() => setShowDetailsModal(true)}
            >
              View Details
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete Client"
            >
              <Trash2 className="icon-sm" />
            </button>
          </div>
        </td>
      </tr>

      {/* Client Details Modal */}
      {showDetailsModal && (
        <ClientDetailsModal
          client={client}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={onUpdate}
          
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-container modal-small">
            <div className="modal-header">
              <h2 className="modal-title">Delete Client</h2>
            </div>
            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete <strong>{client.name}</strong>?
              </p>
              <p className="delete-info">
                This action will permanently delete the client and all
                associated domains, hosting, and email services. This cannot be
                undone.
              </p>
              <div className="modal-actions">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn-danger">
                  Delete Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientRow;
