// Function to fetch and display server status
async function checkServer(serverIp = null) {
    // If no IP is provided, get the value from the input field
    if (!serverIp) {
        serverIp = document.getElementById('serverIp').value;
    }

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear the previous output

    if (!serverIp) {
        outputDiv.innerHTML = '<p class="error">Please enter a server IP.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}`);
        if (!response.ok) throw new Error('Failed to fetch server data');

        const serverData = await response.json();

        if (!serverData.online) {
            outputDiv.innerHTML = `<p class="error">Server is offline or unreachable.</p>`;
            return;
        }

        const serverIcon = serverData.icon
            ? `<img src="${serverData.icon}" alt="Server Icon">`
            : ``;

        const serverName = serverData.motd && serverData.motd.clean.length > 0
            ? serverData.motd.clean[0]
            : "Unknown Server";

        const playersList = serverData.players.list
            ? `<ul>${serverData.players.list.map(player => `<li>${player}</li>`).join('')}</ul>`
            : `<p>No player list available.</p>`;

        // Safely handle plugins and mods
        const plugins = Array.isArray(serverData.plugins) 
            ? serverData.plugins.join(', ') 
            : serverData.plugins || "None";

        const mods = Array.isArray(serverData.mods) 
            ? serverData.mods.join(', ') 
            : serverData.mods || "None";

        const serverInfo = `
            <div class="server-info">
                ${serverIcon}
                <p><strong>Server Name:</strong> ${serverName}</p>
                <p><strong>Server IP:</strong> ${serverIp}</p>
                <p><strong>Online Players:</strong> ${serverData.players.online} / ${serverData.players.max}</p>
                <p><strong>Version:</strong> ${serverData.version || "N/A"}</p>
                <p><strong>Software:</strong> ${serverData.software || "N/A"}</p>
                <p><strong>Supported Versions:</strong> ${serverData.protocol ? serverData.protocol : "Unknown"}</p>
                <p><strong>MOTD:</strong> ${serverData.motd.clean.join('<br>')}</p>
                <p><strong>Players List:</strong></p>
                ${playersList}
                <p><strong>Plugins:</strong> ${plugins}</p>
                <p><strong>Mods:</strong> ${mods}</p>
            </div>
        `;
        outputDiv.innerHTML = serverInfo;
    } catch (error) {
        outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}
