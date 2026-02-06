function calculateEstimate() {
    const servicePrice = parseFloat(document.getElementById("service").value);
    const size = parseInt(document.getElementById("size").value);
    const urgent = document.getElementById("urgent").checked;

    let total = servicePrice * size;

    if (urgent) {
        total *= 1.2;
    }

    document.getElementById("price").textContent = `$${total.toFixed(2)}`;
}
