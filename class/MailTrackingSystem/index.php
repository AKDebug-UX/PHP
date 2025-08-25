<?php
// Updated HTML file with PHP integration
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mail Tracking System - Ekiti State University</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Include all the CSS from the previous HTML file here */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
        }

        /* All the CSS styles from the previous file... */
        /* (Include all the CSS from the HTML file here for brevity) */
    </style>
</head>
<body>
    <!-- Same HTML structure as before -->
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo">ESU</div>
                <div>
                    <div class="university-name">MAIL TRACKING SYSTEM</div>
                    <div class="system-name">Ekiti State University</div>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="openAddMailModal()">
                    <i class="fas fa-plus"></i>
                    New Mail
                </button>
            </div>
        </div>
    </header>

    <!-- Rest of the HTML structure remains the same -->
    <!-- ... -->

    <script>
        // Updated JavaScript with API integration
        const API_BASE_URL = 'api/';

        // Load data from API
        async function loadMailData() {
            try {
                const response = await fetch(API_BASE_URL + 'read_mails.php');
                const data = await response.json();
                
                if (data.records) {
                    mailData = data.records.map(mail => ({
                        id: parseInt(mail.id),
                        trackingNumber: mail.tracking_number,
                        sender: mail.sender,
                        recipient: mail.recipient,
                        subject: mail.subject,
                        status: mail.status,
                        priority: mail.priority,
                        department: mail.department,
                        description: mail.description,
                        dateSent: mail.date_sent,
                        dateReceived: mail.date_received
                    }));
                    
                    updateStats();
                    renderRecentActivity();
                    renderMailList();
                    updateReports();
                }
            } catch (error) {
                console.error('Error loading mail data:', error);
            }
        }

        // Load statistics from API
        async function loadStats() {
            try {
                const response = await fetch(API_BASE_URL + 'get_stats.php');
                const stats = await response.json();
                
                document.getElementById('total-count').textContent = stats.total;
                document.getElementById('pending-count').textContent = stats.pending;
                document.getElementById('sent-count').textContent = stats.sent;
                document.getElementById('received-count').textContent = stats.received;
                document.getElementById('returned-count').textContent = stats.returned;
                
                updateReportsFromStats(stats);
            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        }

        // Add mail via API
        async function addMail(event) {
            event.preventDefault();
            
            const mailData = {
                sender: document.getElementById('sender').value,
                recipient: document.getElementById('recipient').value,
                subject: document.getElementById('subject').value,
                status: document.getElementById('status').value,
                priority: document.getElementById('priority').value,
                department: document.getElementById('department').value,
                description: document.getElementById('description').value
            };

            try {
                const response = await fetch(API_BASE_URL + 'create_mail.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mailData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert('Mail added successfully! Tracking Number: ' + result.tracking_number);
                    closeAddMailModal();
                    loadMailData();
                    loadStats();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error adding mail:', error);
                alert('Error adding mail. Please try again.');
            }
        }

        // Track mail via API
        async function trackMail() {
            const trackingNumber = document.getElementById('track-input').value.trim();
            const resultsContainer = document.getElementById('track-results');

            if (!trackingNumber) {
                resultsContainer.innerHTML = '<p style="color: #ef4444;">Please enter a tracking number.</p>';
                return;
            }

            try {
                const response = await fetch(API_BASE_URL + 'track_mail.php?tracking_number=' + encodeURIComponent(trackingNumber));
                const data = await response.json();

                if (response.ok && data.records && data.records.length > 0) {
                    const mail = data.records[0];
                    resultsContainer.innerHTML = `
                        <div class="card" style="border-left: 4px solid #3b82f6; margin-top: 1rem;">
                            <div class="card-content">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                                    <div>
                                        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${mail.tracking_number}</h3>
                                        <div style="space-y: 0.5rem;">
                                            <p><strong>Subject:</strong> ${mail.subject}</p>
                                            <p><strong>From:</strong> ${mail.sender}</p>
                                            <p><strong>To:</strong> ${mail.recipient}</p>
                                            <p><strong>Department:</strong> ${mail.department}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                                            <span class="badge status ${mail.status}">${mail.status.toUpperCase()}</span>
                                            <span class="badge ${mail.priority}">${mail.priority} priority</span>
                                        </div>
                                        <div style="space-y: 0.5rem;">
                                            ${mail.date_sent ? `<p><strong>Date Sent:</strong> ${mail.date_sent}</p>` : ''}
                                            ${mail.date_received ? `<p><strong>Date Received:</strong> ${mail.date_received}</p>` : ''}
                                            <p><strong>Description:</strong> ${mail.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    resultsContainer.innerHTML = '<p style="color: #ef4444;">No mail found with that tracking number.</p>';
                }
            } catch (error) {
                console.error('Error tracking mail:', error);
                resultsContainer.innerHTML = '<p style="color: #ef4444;">Error tracking mail. Please try again.</p>';
            }
        }

   