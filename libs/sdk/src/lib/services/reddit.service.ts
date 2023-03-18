import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import Snoowrap = require('snoowrap');
import { getDiscordTextChannels } from '../helpers/discord-channels';
import { isUrlAnImage } from '../helpers/url-image';
import { SdkConfiguration } from '../models/configurations/sdk-configuration';
import {
  SubmissionData,
  SubmissionResult,
  SubmissionType,
} from '../models/submission';
import { sendSubmissionAsContentText } from './submissions/content-text';
import { sendSubmissionAsGallery } from './submissions/gallery';
import { sendSubmissionAsImage } from './submissions/image';
import { sendStats } from './submissions/stats';
import { sendSubmissionAsText } from './submissions/text';
import { sendSubmissionAsVideo } from './submissions/video';

export class RedditService {
  constructor(
    private discord: Client,
    private configuration: SdkConfiguration
  ) {}

  sendSubmissionsToChannels(): void {
    const startTime = performance.now();
    const channels = getDiscordTextChannels(this.discord);

    channels.forEach((channel) => this.sendSubmissionsToChannel(channel));

    const timeTaken = performance.now() - startTime;
    sendStats(this.discord, this.configuration, timeTaken);
  }

  async sendSubmissionsToChannel(channel: TextChannel): Promise<void> {
    try {
      if (!channel.topic || channel.topic.trimEnd().includes(' ')) {
        return;
      }

      const reddit = new Snoowrap(this.configuration.reddit);
      const subreddit = reddit.getSubreddit(channel.topic);
      const options = this.configuration.reddit.post;
      const submissions = await subreddit.getTop(options);

      for (const submission of submissions) {
        await this.sendSubmissionToChannel(channel, submission);
      }
    } catch (err) {
      console.error('❌', err);
      this.sendEmbedError(channel);
    }
  }

  private async sendSubmissionToChannel(
    channel: TextChannel,
    submission: Submission
  ): Promise<void> {
    const data = { channel, submission, configuration: this.configuration };

    try {
      const submissionType = this.getSubmissionType(submission);
      const submissionActionMap = this.getSubmissionActionMap();
      const submissionAction = submissionActionMap[submissionType];
      const submissionResult = await submissionAction(data);

      if (submissionResult === SubmissionResult.Error) {
        await sendSubmissionAsText(data);
      }
    } catch (err) {
      console.error('❌', err);
      await sendSubmissionAsText(data);
    }
  }

  private getSubmissionActionMap(): Record<
    SubmissionType,
    (data: SubmissionData) => Promise<SubmissionResult>
  > {
    return {
      Image: sendSubmissionAsImage,
      Video: sendSubmissionAsVideo,
      Gallery: sendSubmissionAsGallery,
      Selftext: sendSubmissionAsContentText,
      Unknown: sendSubmissionAsText,
    };
  }

  getSubmissionType(submission: Submission): SubmissionType {
    if (submission.url.includes('gallery')) return 'Gallery';
    if (isUrlAnImage(submission.url)) return 'Image';
    if (submission.is_video) return 'Video';
    if (submission.selftext !== '') return 'Selftext';
    return 'Unknown';
  }

  private async sendEmbedError(channel: TextChannel): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(channel.topic)
      .setDescription(`Le reddit /r/${channel.topic} ne semble pas disponible`)
      .setURL(`${this.configuration.reddit.serviceUrl}/r/${channel.topic}`);

    await channel.send({ embeds: [embed] });
  }
}
