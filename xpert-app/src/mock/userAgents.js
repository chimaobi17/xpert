import { agents } from './agents';

export const defaultAgentsByDomain = {
  technology: [1, 4, 6],
  creative: [2, 7],
  business: [3, 2, 9],
  research: [4, 9, 5],
  language: [5, 2, 4],
};

let _userAgentIds = [1, 2, 3, 4, 6];

export function getUserAgents() {
  return agents.filter((a) => _userAgentIds.includes(a.id));
}

export function addUserAgent(agentId) {
  if (!_userAgentIds.includes(agentId)) {
    _userAgentIds.push(agentId);
  }
}

export function removeUserAgent(agentId) {
  _userAgentIds = _userAgentIds.filter((id) => id !== agentId);
}

export function isAgentAdded(agentId) {
  return _userAgentIds.includes(agentId);
}

export function assignDefaultAgents(specialization) {
  const defaults = defaultAgentsByDomain[specialization] || [1, 2, 3];
  _userAgentIds = [...new Set([..._userAgentIds, ...defaults])];
  return getUserAgents();
}
