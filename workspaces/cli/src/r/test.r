library(zoo)
library(MASS)
library(fitdistrplus)
library(logitnorm)
library(extraDistr)
library(invgamma)


#### Data
class = '__class__'
subclass = '__subclass__'
characteristic = '__field__'
data = read.csv(file='/tmp/ocpu-store/__CSV__', header=TRUE, sep=',')[[characteristic]]

fit = fitdistr(x=data, dinvgamma, list(shape=1, rate=1), lower=0.01)


GetMeanToModeCorrection = function(d, quantile) {
    left = qinvgamma(  quantile/2 + d, shape=fit$estimate['shape'], rate=fit$estimate['rate'])
    right = qinvgamma(1-quantile/2 + d, shape=fit$estimate['shape'], rate=fit$estimate['rate'])
    diff = dinvgamma(x=left, shape=fit$estimate['shape'], rate=fit$estimate['rate']) - dinvgamma(x=right, shape=fit$estimate['shape'], rate=fit$estimate['rate'])
    return(abs(diff))
}
shiftFromMeanToMode = list(
    at05 = optimize(GetMeanToModeCorrection, c(-0.025, 0), 0.05, tol=0.0001)$minimum,
    at20 = optimize(GetMeanToModeCorrection, c(-0.100, 0), 0.20, tol=0.0001)$minimum,
    at50 = optimize(GetMeanToModeCorrection, c(-0.250, 0), 0.50, tol=0.0001)$minimum
)
quantile = list(
    xleft05  = qinvgamma(  0.05/2 + shiftFromMeanToMode$at05, shape=fit$estimate['shape'], rate=fit$estimate['rate']),
    xleft20  = qinvgamma(  0.20/2 + shiftFromMeanToMode$at20, shape=fit$estimate['shape'], rate=fit$estimate['rate']),
    xleft50  = qinvgamma(  0.50/2 + shiftFromMeanToMode$at50, shape=fit$estimate['shape'], rate=fit$estimate['rate']),
    xright50 = qinvgamma(1-0.50/2 + shiftFromMeanToMode$at50, shape=fit$estimate['shape'], rate=fit$estimate['rate']),
    xright20 = qinvgamma(1-0.20/2 + shiftFromMeanToMode$at20, shape=fit$estimate['shape'], rate=fit$estimate['rate']),
    xright05 = qinvgamma(1-0.05/2 + shiftFromMeanToMode$at05, shape=fit$estimate['shape'], rate=fit$estimate['rate'])
)
cdf98 = qinvgamma(0.98, shape=fit$estimate['shape'], rate=fit$estimate['rate'])


dataTruncated = data[data < cdf98]


breakCountMax = floor(sqrt(length(dataTruncated)))
buckets = hist(dataTruncated, breaks=breakCountMax, right=FALSE, plot=FALSE)


distline.step = (buckets$breaks[2] - buckets$breaks[1])
distline.x = seq(min(buckets$breaks) + distline.step/2, max(buckets$breaks) - distline.step/2, distline.step / 10)
distline.y = dinvgamma(distline.x, shape=fit$estimate['shape'], rate=fit$estimate['rate'])*length(data)*distline.step
mode = distline.x[match(max(distline.y), distline.y)]

null.probs = dinvgamma(buckets$mids, shape=fit$estimate['shape'], rate=fit$estimate['rate'])*length(data)*distline.step
test = chisq.test(buckets$counts, null.probs, rescale.p=TRUE)

legend = list(
    Data = paste(length(data), 'blueprints (vanilla, subscribers > 100)'),
    Model = paste('Inv.Gamma Dist. (shape=',round(fit$estimate['shape'], 2),', rate=',round(fit$estimate['rate']), '), p=', round(test$p.value * 100, 1), '%'),
    at05 = paste('95% sector: ', round(quantile$xleft05), ' - ', round(quantile$xright05), ' ( width=',round(quantile$xright05-quantile$xleft05), ')'),
    at20 = paste('80% sector: ', round(quantile$xleft20), ' - ', round(quantile$xright20), ' ( width=',round(quantile$xright20-quantile$xleft20), ')'),
    at50 = paste('50% sector: ', round(quantile$xleft50), ' - ', round(quantile$xright50), ' ( width=',round(quantile$xright50-quantile$xleft50), ')'),
    mode = paste('median =', round(mode), characteristic)
)

par(mfrow = c(1, 1))
ylim = max(c(max(distline.y), max(buckets$counts)))
hist(dataTruncated, breaks=breakCountMax, col='grey', xlim=c(0, cdf98), xlab=characteristic, ylim=c(0, ylim), main=paste('', class, '(', round(mode), characteristic, ')'))
lines(x=buckets$mids, y=null.probs, col='blue', type='p')
lines(x=distline.x, y=distline.y, col='blue', lwd=3)
# lines(x=buckets$breaks[buckets$breaks > buckets$breaks[1]] - (buckets$breaks[2] - buckets$breaks[1])/2, y=buckets$counts, col='yellow', lwd=5)
# lines(x=buckets$breaks[buckets$breaks > buckets$breaks[1]] - (buckets$breaks[2] - buckets$breaks[1])/2, y=null.probs, col='red', lwd=5)
rect(xleft=0,                 xright=quantile$xright05, ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='grey')
rect(xleft=quantile$xleft05,  xright=quantile$xright05, ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='red')
rect(xleft=quantile$xleft20,  xright=quantile$xright50, ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='yellow')
rect(xleft=quantile$xleft50,  xright=quantile$xright50, ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='green')
rect(xleft=quantile$xright50, xright=quantile$xright20, ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='yellow')
rect(xleft=quantile$xright20, xright=quantile$xright05, ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='red')
rect(xleft=quantile$xright05, xright=max(data)        , ybottom=par('usr')[3], ytop=par('usr')[4], density=30, border = 'transparent', col='grey')
legend('topright', c(legend$Data, legend$Model, legend$mode, legend$at50, legend$at20, legend$at05), fill=c('grey', 'blue', 'black', 'green', 'yellow', 'red'))
abline(v=mode, lwd=2, col='black')
