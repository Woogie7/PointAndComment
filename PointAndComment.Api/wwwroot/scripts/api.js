const API_BASE = 'http://localhost:5177/';
export async function fetchPoints() {
    const resp = await fetch(`${API_BASE}points`);
    if (!resp.ok) throw new Error('Failed to fetch points');
    return await resp.json();
}

export async function fetchPointById(id) {
    const res = await fetch(`${API_BASE}points/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

export async function addPoint(point) {
    const resp = await fetch(`${API_BASE}points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(point),
    });
    if (!resp.ok) throw new Error('Failed to add point');
    return await resp.json(); 
}

export async function deletePoint(pointId) {
    const resp = await fetch(`${API_BASE}points/${pointId}`, {
        method: 'DELETE',
    });
    if (!resp.ok) throw new Error('Failed to delete point');
}

export async function updatePointColor(pointId, newColor) {
    const resp = await fetch(`${API_BASE}points/${pointId}/color`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColor),
    });
    if (!resp.ok) throw new Error('Failed to update point color');
}

export async function updatePointPosition(pointId, pos) {
    const resp = await fetch(`${API_BASE}points/${pointId}/position`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pos),
    });
    if (!resp.ok) throw new Error('Failed to update point position');
}

export async function addCommentToPoint(pointId, comment) {
    const resp = await fetch(`${API_BASE}points/${pointId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
    });
    if (!resp.ok) throw new Error('Failed to add comment');
}

export async function updateComment(commentId, comment) {
    const resp = await fetch(`${API_BASE}comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
    });
    if (!resp.ok) throw new Error('Failed to update comment');
}

export async function deleteComment(commentId) {
    const resp = await fetch(`${API_BASE}comments/${commentId}`, {
        method: 'DELETE',
    });
    if (!resp.ok) throw new Error('Failed to delete comment');
}
