import axios from 'axios';

interface SocialStats {
  platform: string;
  followers: number;
  error?: string;
}

export class SocialService {
  private static readonly API_ENDPOINTS = {
    twitter: 'https://api.twitter.com/2/users',
    instagram: 'https://graph.instagram.com/me',
    linkedin: 'https://api.linkedin.com/v2/connections',
    github: 'https://api.github.com/users'
  };

  static async getTwitterFollowers(username: string): Promise<SocialStats> {
    try {
      // Note: This would require Twitter API credentials in production
      const response = await axios.get(`${this.API_ENDPOINTS.twitter}/${username}`);
      return {
        platform: 'twitter',
        followers: response.data.public_metrics.followers_count
      };
    } catch (error) {
      console.error('Twitter API error:', error);
      return { platform: 'twitter', followers: 0, error: 'Failed to fetch Twitter followers' };
    }
  }

  static async getInstagramFollowers(username: string): Promise<SocialStats> {
    try {
      // Note: This would require Instagram API credentials in production
      const response = await axios.get(this.API_ENDPOINTS.instagram);
      return {
        platform: 'instagram',
        followers: response.data.followers_count
      };
    } catch (error) {
      console.error('Instagram API error:', error);
      return { platform: 'instagram', followers: 0, error: 'Failed to fetch Instagram followers' };
    }
  }

  static async getGithubFollowers(username: string): Promise<SocialStats> {
    try {
      const response = await axios.get(`${this.API_ENDPOINTS.github}/${username}`);
      return {
        platform: 'github',
        followers: response.data.followers
      };
    } catch (error) {
      console.error('GitHub API error:', error);
      return { platform: 'github', followers: 0, error: 'Failed to fetch GitHub followers' };
    }
  }

  static async getAllSocialStats(socialLinks: { platform: string; url: string }[]): Promise<SocialStats[]> {
    const stats: SocialStats[] = [];

    for (const link of socialLinks) {
      const username = this.extractUsername(link.url, link.platform);
      if (!username) continue;

      switch (link.platform.toLowerCase()) {
        case 'twitter':
          stats.push(await this.getTwitterFollowers(username));
          break;
        case 'instagram':
          stats.push(await this.getInstagramFollowers(username));
          break;
        case 'github':
          stats.push(await this.getGithubFollowers(username));
          break;
      }
    }

    return stats;
  }

  private static extractUsername(url: string, platform: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[0] || null;
    } catch {
      return null;
    }
  }

  static calculateTotalFollowers(stats: SocialStats[]): number {
    return stats.reduce((total, stat) => total + stat.followers, 0);
  }
}